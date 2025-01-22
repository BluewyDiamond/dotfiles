import { Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { NotificationMap } from "./NotificationMap";
import PopupWindow, { LayoutPosition } from "../wrappers/PopupWindow";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const notificationMap = new NotificationMap();

   return PopupWindow(
      {
         gdkmonitor: gdkmonitor,
         name: "astal-notifications-overview",
         cssClasses: ["notifications-overview"],
         position: LayoutPosition.TOP_CENTER,
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
               child: Widget.Box({
                  cssClasses: ["notifications-box"],
                  vertical: true,
                  vexpand: true,

                  setup: (self) => {
                     self.children = notificationMap.get()

                     notificationMap.subscribe((list) => {
                        self.children = list
                     })
                  }
               }),
            }),
         ],
      })
   );
}
