import { Astal, type Gdk, type Gtk, Widget } from "astal/gtk4";
import PopupWindow, { Position } from "../../composables/PopupWindow";
import { NotificationsEfficientRenderingMap } from "./NotificationsEfficientRenderingMap";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const notificationsEfficientRenderingMap =
      new NotificationsEfficientRenderingMap();

   const notificationsBox = Widget.Box({
      vertical: true,

      onDestroy: () => {
         notificationsEfficientRenderingMap.destroy();
      },
   });

   const mainBox = Widget.Box({
      cssClasses: ["main-box"],
      hexpand: false,
      vexpand: false,
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

   onNotificationWidgetsChanged(notificationsEfficientRenderingMap.get());

   notificationsEfficientRenderingMap.subscribe((list) => {
      onNotificationWidgetsChanged(list);
   });

   return window;
}
