import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import { curateIcon, printError } from "../../../../libs/utils";
import icons from "../../../../libs/icons";
import CustomIcon from "../../../../libs/wrappers/CustomIcon";

const errorTitle = "ScreenShareIndicator";

export default function (): Widget.Box {
  const video = Wp.get_default()?.get_video();

  if (!video) {
    printError(`${errorTitle} => Failed to get video...`);

    return new Widget.Box({
      children: [new Widget.Label({ label: "󱪗" })],
    });
  }

  return new Widget.Box({
    setup: (self) => {
      // init
      onVideoRecordersChange(video);

      self.hook(video, "notify::recorders", () => {
        onVideoRecordersChange(video);
      });

      function onVideoRecordersChange(video: Wp.Video) {
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

        self.children = [CustomIcon({ icon2: icons.recorder.screencast })];
        self.visible = true;
      }
    },
  });
}
