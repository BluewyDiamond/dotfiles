import { Astal, Gtk, Widget } from "astal/gtk4";
import { NotificationsEfficientRenderingMap } from "./NotificationsEfficientRenderingMap";

export default function (): Astal.Box {
   const notificationsEfficientRendering =
      new NotificationsEfficientRenderingMap();

   return Widget.Box({
      cssClasses: ["control-center-notifications-box"],
      vertical: true,
      hexpand: false,
      vexpand: false,

      children: [
         Widget.Box({
            cssClasses: ["actions-box"],

            children: [
               Widget.Button({
                  child: Widget.Label({ label: "Clear All" }),

                  onClicked: async () => {
                     await notificationsEfficientRendering.clear();
                  },
               }),
            ],
         }),

         new Gtk.ScrolledWindow({
            hexpand: true,
            vexpand: true,
            vscrollbarPolicy: Gtk.PolicyType.ALWAYS,
            hscrollbarPolicy: Gtk.PolicyType.NEVER,

            child: Widget.Box({
               cssClasses: ["notifications-box"],
               vertical: true,

               setup: (self) => {
                  self.children = notificationsEfficientRendering.get();

                  notificationsEfficientRendering.subscribe((list) => {
                     self.children = list;
                  });
               },
            }),
         }),
      ],
   });
}
