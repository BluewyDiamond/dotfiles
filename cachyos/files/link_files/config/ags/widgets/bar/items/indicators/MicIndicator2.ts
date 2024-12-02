import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import icons from "../../../../libs/icons";
import CustomIcon from "../../../wrappers/CustomIcon";
import { printError } from "../../../../utils";

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

        const { muted, low, medium, high } = icons.audio.mic;

        const states = [
          [67, high],
          [34, medium],
          [1, low],
          [0, muted],
        ] as const;

        const icon =
          states.find(([state]) => state <= micVolume * 100)?.[1] || "";

        self.children = [CustomIcon({ icon2: icon })];
      }
    },
  });
}
