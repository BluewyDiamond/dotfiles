import { timeout, Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/Notification";
import options from "../../options";
import Hookable from "../../libs/services/Hookable";

const notifd = Notifd.get_default();

export class NotificationMap extends Hookable implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      super();

      const capNotifications = () => {
         if (this.map.size >= options.notificationsPopup.maxItems) {
            const item = this.map.entries().next().value;
            if (!item) return;
            this.map.delete(item[0]);
            this.notify();
         }
      };

      notifd.notifications.forEach((notification) => {
         capNotifications();

         this.map.set(
            notification.id,

            Notification({
               notification: notifd.get_notification(notification.id),

               setup: () => {
                  if (options.notificationsPopup.timeout) {
                     timeout(options.notificationsPopup.timeout, () =>
                        this.map.delete(notification.id)
                     );
                  }
               },
            })
         );

         this.notify();
      });

      this.hook(notifd, "notified", (_, id) => {
         capNotifications();
         const notification = notifd.get_notification(id);

         this.map.set(
            id,

            Notification({
               notification: notification,

               setup: () => {
                  if (!options.notificationsPopup.timeout) return;

                  timeout(options.notificationsPopup.timeout, () => {
                     this.map.delete(notification.id);
                     this.notify();
                  });
               },
            })
         );

         this.notify();
      });

      this.hook(notifd, "resolved", (_, id) => {
         this.map.delete(id);
         this.notify();
      });
   }

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
   }

   destroy() {
      super.destroy();
      this.var.drop();
   }

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }
}
