import { Widget } from "astal/gtk3";
import { curateIcon, printError } from "../../../../libs/utils";
import Wp from "gi://AstalWp";
import icons from "../../../../libs/icons";

const errorTitle = "SpeakerIndicator";

export default function (): Widget.Box {
  const audio = Wp.get_default()?.get_audio();

  if (!audio) {
    printError(`${errorTitle} => Failed to get audio...`);

    return new Widget.Box({
      children: [new Widget.Label({ label: "󱪗" })],
    });
  }

  const speaker = audio.get_default_speaker();

  if (!speaker) {
    printError(`${errorTitle} => Failed to get speaker...`);

    return new Widget.Box({
      children: [new Widget.Label({ label: "󱪗" })],
    });
  }

  return new Widget.Box({
    setup: (self) => {
      self.hook(speaker, "notify::volume", () => {
        const speakerVolume = speaker.get_volume();
        const { muted, low, medium, high, overamplified } = icons.audio.volume;

        const iconStates = [
          [101, overamplified],
          [67, high],
          [34, medium],
          [1, low],
          [0, muted],
        ] as const;

        const textStates = [
          [101, "speaker overamplified"],
          [67, "speaker high"],
          [34, "speaker medium"],
          [1, "speaker low"],
          [0, "speaker muted"],
        ] as const;

        const curatedIcon = curateIcon(
          iconStates.find(([state]) => state <= speakerVolume * 100)?.[1] || ""
        );

        const curatedText =
          textStates.find(([state]) => state <= speakerVolume * 100)?.[1] || "";

        if (curatedIcon !== "") {
          self.children = [new Widget.Icon({ icon: curatedIcon })];
          self.visible = true;
        } else if (curatedText !== "") {
          self.children = [new Widget.Label({ label: curatedText })];
          self.visible = true;
        } else {
          printError(`${errorTitle} => there is nothing to show...`);
          self.children = [new Widget.Label({ label: "󱪗" })];
          self.visible = false;
        }
      });
    },
  });
}
