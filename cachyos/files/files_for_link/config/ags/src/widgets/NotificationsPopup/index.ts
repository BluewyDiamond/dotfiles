import { Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { NotificationMap } from "./NotificationMap";
import PopupWindow, { Position as Position } from "../wrappers/PopupWindow";
import Pango from "gi://Pango?version=1.0";

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
         gdkmonitor: gdkmonitor,
         name: "astal-notifications-popup",
         cssClasses: ["notifications-popup"],
         position: Position.TOP_RIGHT,
         layer: Astal.Layer.OVERLAY,
         exclusivity: Astal.Exclusivity.NORMAL,
         keymode: Astal.Keymode.NONE,
      },

      mainBox
   );

   function onNotificationWidgetsChanged(list: Gtk.Widget[]) {
      notificationsBox.children = list;

      if (list.length <= 0) {
         window.visible = false;
      } else {
         window.visible = true;
      }
   }

   onNotificationWidgetsChanged(notificationMap.get());

   notificationMap.subscribe((list) => {
      onNotificationWidgetsChanged(list);
   });

   return window;
}
