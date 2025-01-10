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
         className: "main-box",
         vertical: true,

         children: [
            new Widget.Box({
               className: "actions-box",

               children: [
                  new Widget.Button({
                     child: new Widget.Label({ label: "Clear All" }),

                     onClick: () => {
                        notificationMap.clear();
                     },
                  }),
               ],
            }),

            new Widget.Box({
               className: "notifications-box",
               vertical: true,

               setup: (self) => {
                  self.children = notificationMap.get();

                  notificationMap.subscribe((list) => {
                     self.children = list;
                  });
               },
            }),
         ],
      }),

      onDestroy: () => {
         notificationMap.destroy();
      },
   });
}
