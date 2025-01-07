import { timeout, Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "../wrappers/Notification";
import options from "../../options";

const notifd = Notifd.get_default();

export class NotificationMap implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      notifd.notifications.forEach((notification) => {
         this.set(
            notification.id,
            Notification({
               notification: notifd.get_notification(notification.id),

               setup: () => {
                  if (options.notificationsPopup.timeout) {
                     timeout(options.notificationsPopup.timeout, () =>
                        this.delete(notification.id)
                     );
                  }
               },
            })
         );
      });

      notifd.connect("notified", (_, id) => {
         const notification = notifd.get_notification(id);

         this.set(
            id,
            Notification({
               notification: notification,

               setup: () => {
                  if (options.notificationsPopup.timeout) {
                     timeout(options.notificationsPopup.timeout, () =>
                        this.delete(notification.id)
                     );
                  }
               },
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

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }
}
