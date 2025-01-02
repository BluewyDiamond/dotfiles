import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import { Subscribable } from "astal/binding";
import { timeout, Variable } from "astal";
import Notifd from "gi://AstalNotifd";
import Notification from "../wrappers/Notification";

export class NotificationMap implements Subscribable {
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
         this.set(
            notification.id,

            Notification(notification, {
               setup: () => {
                  timeout(5000, () => {
                     this.delete(notification.id);
                  });
               },
            })
         );
      });

      notifd.connect("notified", (_, id) => {
         this.set(
            id,

            Notification(notifd.get_notification(id), {
               setup: () => {
                  timeout(5000, () => {
                     this.delete(id);
                  });
               },
            })
         );
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