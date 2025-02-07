import { Astal, type Gdk, Gtk, Widget } from "astal/gtk4";
import { NotificationMap } from "./NotificationMap";
import PopupWindow, { Position } from "../composables/PopupWindow";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const notificationMap = new NotificationMap();

   return PopupWindow(
      {
        gdkmonitor,
         name: "astal-notifications-overview",
         cssClasses: ["notifications-overview"],
         position: Position.TOP_CENTER,
         exclusivity: Astal.Exclusivity.NORMAL,
      },

      Widget.Box({
         cssClasses: ["main-box"],
         vertical: true,
         hexpand: false,
         vexpand: false,

         children: [
            Widget.Box({
               cssClasses: ["actions-box"],

               children: [
                  Widget.Button({
                     child: Widget.Label({ label: "Clear All" }),

                     onClicked: () => {
                        notificationMap.clear();
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
                     self.children = notificationMap.get();

                     notificationMap.subscribe((list) => {
                        self.children = list;
                     });
                  },
               }),
            }),
         ],
      })
   );
}
