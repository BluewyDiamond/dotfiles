import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "../wrappers/Notification";
import { NotificationMap } from "./NotificationMap";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-overview",
      className: "notifications-overview",
      exclusivity: Astal.Exclusivity.NORMAL,
      layer: Astal.Layer.TOP,
      anchor: Astal.WindowAnchor.TOP,
      visible: false,
      child: Notifications(),
   });
}

function Notifications(): Widget.Box {
   const notificationMap = new NotificationMap();

   return new Widget.Box({
      className: "notifications-overview-content",
      vertical: true,

      setup: (self) => {
         self.children = notificationMap.get();

         notificationMap.subscribe((list) => {
            self.children = list;
         });
      },
   });
}
