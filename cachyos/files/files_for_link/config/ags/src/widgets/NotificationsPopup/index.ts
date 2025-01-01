import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import Notifd from "gi://AstalNotifd";
import Notification from "../common/Notification";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const notifd = Notifd.get_default();

   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-notifications-popup",
      namespace: "astal-notifications-popup",
      className: "notifications-popup",
      layer: Astal.Layer.OVERLAY,
      anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
      child: Notifications(),

      setup: (self) => {
         onNotificationsChanged();

         self.hook(notifd, "notify::notifications", () =>
            onNotificationsChanged()
         );

         function onNotificationsChanged() {
            if (notifd.notifications.length > 0) {
               self.visible = true;
            } else {
               self.visible = false;
            }
         }
      },
   });
}

function Notifications(): Widget.Box {
   const notificationMap = new NotificationMap();

   return new Widget.Box({
      className: "notifications-popup-content",
      vertical: true,

      setup: (self) => {
         self.children = notificationMap.get();

         notificationMap.subscribe((list) => {
            self.children = list;
         });
      },
   });
}

class NotificationMap implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private var: Variable<Gtk.Widget[]> = Variable([]);

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
   }

   constructor() {
      const notifd = Notifd.get_default();

      notifd.notifications.forEach((notification) => {
         this.set(notification.id, Notification(notification));
      });

      notifd.connect("notified", (_, id) => {
         this.set(id, Notification(notifd.get_notification(id)));
      });

      notifd.connect("resolved", (_, id) => {
         this.delete(id);
      });
   }

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }

   private set(key: number, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: number) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }
}
