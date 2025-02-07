import { Astal, type Gdk, type Gtk, Widget } from "astal/gtk4";
import { NotificationMap } from "./NotificationMap";
import PopupWindow, { Position } from "../composables/PopupWindow";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const notificationMap = new NotificationMap();

   const notificationsBox = Widget.Box({
      vertical: true,

      onDestroy: () => {
         notificationMap.destroy();
      },
   });

   const mainBox = Widget.Box({
      cssClasses: ["main-box"],
      hexpand: false,
      children: [notificationsBox],
   });

   const window = PopupWindow(
      {
         gdkmonitor,
         name: "astal-notifications-popup",
         cssClasses: ["notifications-popup"],
         position: Position.TOP_RIGHT,
         layer: Astal.Layer.OVERLAY,
         exclusivity: Astal.Exclusivity.NORMAL,
         keymode: Astal.Keymode.NONE,
         clickThroughFiller: true,
      },

      mainBox
   );

   const onNotificationWidgetsChanged = (list: Gtk.Widget[]): void => {
      notificationsBox.children = list;

      if (list.length <= 0) {
         window.visible = false;
      } else {
         window.visible = true;
      }
   };

   onNotificationWidgetsChanged(notificationMap.get());

   notificationMap.subscribe((list) => {
      onNotificationWidgetsChanged(list);
   });

   return window;
}
