import { Astal, Gdk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { NotificationMap } from "./NotificationMap";
import { bind } from "astal";

function Notifications(): Widget.Box {
   const notificationMap = new NotificationMap();

   return new Widget.Box({
      className: "notifications-popup-content",
      vertical: true,
      noImplicitDestroy: true,
      children: bind(notificationMap),

      onDestroy: () => {
         notificationMap.destroy();
      },
   });
}

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const notifd = Notifd.get_default();

   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-popup",
      namespace: "astal-notifications-popup",
      className: "notifications-popup",
      layer: Astal.Layer.OVERLAY,
      //exclusivity: Astal.Exclusivity.IGNORE,
      anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
      child: Notifications(),

      setup: (self) => {
         function onNotificationsChanged() {
            if (notifd.notifications.length > 0) {
               self.visible = true;
            } else {
               self.visible = false;
            }
         }

         onNotificationsChanged();

         self.hook(notifd, "notify::notifications", () =>
            onNotificationsChanged()
         );
      },
   });
}
