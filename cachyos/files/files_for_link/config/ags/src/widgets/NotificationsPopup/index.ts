import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { NotificationMap } from "./NotificationMap";
import { bind } from "astal";
import { noImplicitDestroy } from "astal/_astal";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const notificationMap = new NotificationMap();

   const mainBox = new Widget.Box({
      className: "notifications-popup-content",
      vertical: true,
      noImplicitDestroy: true,
      children: bind(notificationMap),

      onDestroy: () => {
         notificationMap.destroy();
      },
   });

   const window = new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-popup",
      namespace: "astal-notifications-popup",
      className: "notifications-popup",
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

   notificationMap.subscribe((list) => {
      onNotificationWidgetsChanged(list);
   });

   return window;
}
