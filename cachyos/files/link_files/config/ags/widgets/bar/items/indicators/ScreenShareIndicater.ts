import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import { curateIcon, printError } from "../../../../libs/utils";
import icons from "../../../../libs/icons";

const errorTitle = "ScreenShareIndicator";

export default function (): Widget.Box {
  const video = Wp.get_default()?.get_video();

  if (!video) {
    printError(`${errorTitle} => Failed to get audio...`);

    return new Widget.Box({
      children: [new Widget.Label({ label: "󱪗" })],
    });
  }

  return new Widget.Box({
    setup: (self) => {
      self.hook(video, "notify::recorders", () => {
        const recorders = video.get_recorders();

        if (!recorders) {
          printError(`${errorTitle} => Failed to get recorders...`);
          self.children = [new Widget.Label({ label: "󱪗" })];
          return;
        }

        if (recorders.length <= 0) {
          self.children = [];
          self.visible = false;
          return;
        }

        const curatedIcon = curateIcon(icons.recorder.screencast);
        const curatedLabel: string = "recording screen";

        if (curatedIcon !== "") {
          self.children = [new Widget.Icon({ icon: curatedIcon })];
          self.visible = true;
        } else if (curatedLabel !== "") {
          self.children = [new Widget.Label({ label: curatedLabel })];
          self.visible = true;
        }
      });
    },
  });
}
