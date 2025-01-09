import { Astal, Gdk, Widget } from "astal/gtk3";
import { NotificationMap } from "./NotificationMap";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const notificationMap = new NotificationMap();

   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-overview",
      className: "notifications-overview",
      exclusivity: Astal.Exclusivity.NORMAL,
      layer: Astal.Layer.TOP,
      anchor: Astal.WindowAnchor.TOP,
      visible: false,

      child: new Widget.Box({
         className: "notifications-overview-content",
         vertical: true,

         setup: (self) => {
            self.children = notificationMap.get();

            notificationMap.subscribe((list) => {
               self.children = list;
            });
         },
      }),

      onDestroy: () => {
         notificationMap.destroy();
      },
   });
}
