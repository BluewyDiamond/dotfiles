import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import { Variable } from "astal";
import { curateIcon, printError } from "../../../../libs/utils";
import icons from "../../../../libs/icons";

const errorTitle = "MicIndicator2";

export default function (): Widget.Box {
  const audio = Wp.get_default()?.get_audio();

  if (!audio) {
    printError(`${errorTitle} => Failed to get audio...`);

    return new Widget.Box({
      children: [new Widget.Label({ label: "󱪗" })],
    });
  }

  const mic = audio.get_default_microphone();

  if (!mic) {
    printError(`${errorTitle} => Failed to get default mic...`);

    return new Widget.Box({
      children: [new Widget.Label({ label: "󱪗" })],
    });
  }

  return new Widget.Box({
    setup: (self) => {
      // init state
      onMicRecordersChange(audio);
      onMicVolumeChange(mic);

      self.hook(audio, "notify::recorders", () => {
        onMicRecordersChange(audio);
      });

      self.hook(audio.get_default_microphone()!, "notify::volume", () => {
        onMicVolumeChange(mic);
      });

      // I use parameters to avoid rechecking it to be null.
      function onMicRecordersChange(audio: Wp.Audio) {
        const recorders = audio.get_recorders();

        if (!recorders) {
          printError(`${errorTitle} => Failed to get recorders...`);
          self.children = [new Widget.Label({ label: "󱪗" })];
          return;
        }

        const recordersLength = recorders.length;

        if (recordersLength > 0) {
          self.visible = true;
        } else {
          self.visible = false;
        }
      }

      function onMicVolumeChange(mic: Wp.Endpoint) {
        const micVolume = mic.get_volume();
        let curatedIcon = "";
        let curatedLabel = "";

        if (micVolume >= 0.5) {
          curatedIcon = curateIcon(icons.audio.mic.high);
          curatedLabel = "mic high";
        } else if (micVolume >= 0.25) {
          curatedIcon = curateIcon(icons.audio.mic.medium);
          curatedLabel = "mic mid";
        } else if (micVolume > 0) {
          curatedIcon = curateIcon(icons.audio.mic.low);
          curatedLabel = "mic low";
        } else {
          curatedIcon = curateIcon(icons.audio.mic.muted);
          curatedLabel = "mic muted";
        }

        if (curatedIcon !== "") {
          self.children = [new Widget.Icon({ icon: curatedIcon })];
        } else if (curatedLabel !== "") {
          self.children = [new Widget.Label({ label: curatedLabel })];
        } else {
          printError(`${errorTitle} => there is nothing to show...`);
          self.children = [new Widget.Label({ label: "󱪗" })];
        }
      }
    },
  });
}
