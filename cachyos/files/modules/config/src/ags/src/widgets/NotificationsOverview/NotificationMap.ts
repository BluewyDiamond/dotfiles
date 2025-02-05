import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/Notification";
import Hookable from "../../libs/services/Hookable";

const notifd = Notifd.get_default();

export class NotificationMap extends Hookable implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private variable: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      super();

      notifd.notifications.forEach((notification) => {
         this.map.set(
            notification.id,
            Notification({ notification: notification })
         );

         this.notify();
      });

      this.hook(notifd, "notified", (_, id: number) => {
         const notification = notifd.get_notification(id);
         this.map.set(id, Notification({ notification: notification }));
         this.notify();
      });

      this.hook(notifd, "resolved", (_, id) => {
         this.map.delete(id);
         this.notify();
      });
   }

   get() {
      return this.variable.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.variable.subscribe(callback);
   }

   destroy() {
      super.destroy();
      this.variable.drop();
   }

   clear() {
      this.map.forEach((_, id) => {
         notifd.get_notification(id)?.dismiss();
      });
   }

   private notify() {
      this.variable.set([...this.map.values()].reverse());
   }
}
