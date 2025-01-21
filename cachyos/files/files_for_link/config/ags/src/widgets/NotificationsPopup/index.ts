import { Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { NotificationMap } from "./NotificationMap";
import { bind } from "astal";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const notificationMap = new NotificationMap();

   const mainBox = Widget.Box({
      cssClasses: ["notifications-popup-content"],
      vertical: true,
      noImplicitDestroy: true,
      children: bind(notificationMap),

      onDestroy: () => {
         notificationMap.destroy();
      },
   });

   const window = Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-popup",
      namespace: "astal-notifications-popup",
      cssClasses: ["notifications-popup"],
      layer: Astal.Layer.OVERLAY,
      anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
      child: mainBox,
   });

   function onNotificationWidgetsChanged(list: Gtk.Widget[]) {
      mainBox.children = list;

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
