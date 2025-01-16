import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { NotificationMap } from "./NotificationMap";
import PopupWindow, { LayoutPosition } from "../wrappers/PopupWindow";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const notificationMap = new NotificationMap();

   return PopupWindow(
      {
         gdkmonitor: gdkmonitor,
         name: "astal-notifications-overview",
         className: "notifications-overview",
         position: LayoutPosition.TOP_CENTER,
      },

      new Widget.Box({
         className: "main-box",
         vertical: true,
         expand: false,

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

            new Widget.Scrollable({
               vscroll: Gtk.PolicyType.ALWAYS,
               hscroll: Gtk.PolicyType.NEVER,
               //vexpand: true,

               child: new Widget.Box({
                  className: "notifications-box",
                  vertical: true,
               vexpand: true,

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
