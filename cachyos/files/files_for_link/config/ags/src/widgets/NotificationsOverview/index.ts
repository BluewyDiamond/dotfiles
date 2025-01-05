import { Astal, Gdk, Widget } from "astal/gtk3";
import { NotificationMap } from "./NotificationMap";

const notificationMap = new NotificationMap();

function Notifications(): Widget.Box {
   return new Widget.Box({
      className: "notifications-overview-content",
      vertical: true,

      setup: (self) => {
         self.children = notificationMap.get();

         notificationMap.subscribe((list) => {
            self.children = list;
         });
      },
   });
}

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-overview",
      className: "notifications-overview",
      exclusivity: Astal.Exclusivity.NORMAL,
      layer: Astal.Layer.TOP,
      anchor: Astal.WindowAnchor.TOP,
      visible: false,
      child: Notifications(),
   });
}
