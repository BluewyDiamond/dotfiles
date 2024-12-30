import { Widget } from "astal/gtk3";
import Wp from "gi://AstalWp";
import icons from "../../../libs/icons";
import { findIcon } from "../../../utils";

const errorTitle = "ScreenShareIndicator";

export default function (): Widget.Box {
   const video = Wp.get_default()?.get_video();

   if (!video) {
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
               self.children = [new Widget.Label({ label: "󱪗" })];
               return;
            }

            if (recorders.length <= 0) {
               self.children = [];
               self.visible = false;
               return;
            }

            const curatedIcon = findIcon(icons.recorder.screencast);

            if (curatedIcon === "") {
               self.children = [new Widget.Label({ label: "?" })];
            } else {
               self.children = [new Widget.Icon({ icon: curatedIcon })];
            }

            self.visible = true;
         }
      },
   });
}
