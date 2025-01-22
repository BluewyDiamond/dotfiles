import { Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { NotificationMap } from "./NotificationMap";
import options from "../../options";
import PopupWindow, { LayoutPosition as Position } from "../wrappers/PopupWindow";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const notificationMap = new NotificationMap();

   const filler = Widget.Button({
      hexpand: true,
      vexpand: true,
      widthRequest: options.filler.width,
      canFocus: false,
   });

   const notificationsBox = Widget.Box({
      vertical: true,

      onDestroy: () => {
         notificationMap.destroy();
      },
   });

   const mainBox = Widget.Box({
      cssClasses: ["main-box"],
      children: [filler, notificationsBox],
   });

   const window = PopupWindow(
      {
         gdkmonitor: gdkmonitor,
         name: "astal-notifications-popup",
         cssClasses: ["notifications-popup"],
         position: Position.TOP_RIGHT,
         layer: Astal.Layer.OVERLAY,
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
