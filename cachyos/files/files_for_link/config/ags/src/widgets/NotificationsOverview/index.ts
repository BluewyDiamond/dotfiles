import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "./Notification";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      className: "notifications-overview",
      exclusivity: Astal.Exclusivity.NORMAL,
      name: "astal-notifications-overview",
      layer: Astal.Layer.OVERLAY,
      anchor: Astal.WindowAnchor.TOP,

      child: Notificatons(),
   });
}

function Notificatons(): Widget.Box {
   const notificationWidgets = new NotificationWidgets();

   return new Widget.Box({
      className: "notifications-overview-content",

      setup: (self) => {
         self.children = notificationWidgets.get();

         notificationWidgets.subscribe((list) => {
            self.children = list;
         });
      },
   });
}

class NotificationWidgets implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      const notifd = Notifd.get_default();

      notifd.notifications.forEach((notification) => {
         this.set(
            notification.id,

            Notification({
               notification: notifd.get_notification(notification.id),
               onHoverLost: () => {},
               setup: () => {},
            })
         );
      });

      notifd.connect("notified", (_, id) => {
         this.set(
            id,
            Notification({
               notification: notifd.get_notification(id),
               onHoverLost: () => {},
               setup: () => {},
            })
         );
      });

      notifd.connect("resolved", (_, id) => {
         this.delete(id);
      });
   }

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
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
