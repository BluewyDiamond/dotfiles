import { timeout, Variable } from "astal";
import type { Subscribable } from "astal/binding";
import type { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/Notification";
import options from "../../options";
import Hookable from "../../libs/services/Hookable";

const notifd = Notifd.get_default();

export class NotificationMap extends Hookable implements Subscribable {
   private readonly map: Map<number, Gtk.Widget> = new Map<
      number,
      Gtk.Widget
   >();

   private readonly var: Variable<Gtk.Widget[]> = Variable([]);

   constructor() {
      super();

      const capNotifications = (): void => {
         if (this.map.size >= options.notificationsPopup.maxItems) {
            const [key] = this.map.entries().next().value ?? [];
            if (key === undefined) return;
            this.map.delete(key);
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
                  if (typeof options.notificationsPopup.timeout === "number") {
                     timeout(options.notificationsPopup.timeout, () =>
                        this.map.delete(notification.id)
                     );
                  }
               },
            })
         );

         this.notify();
      });

      this.hook(notifd, "notified", (_, id: number) => {
         capNotifications();
         const notification = notifd.get_notification(id);

         this.map.set(
            id,

            Notification({
               notification: notification,

               setup: () => {
                  if (typeof options.notificationsPopup.timeout !== "number") {
                     return;
                  }

                  timeout(options.notificationsPopup.timeout, () => {
                     this.map.delete(notification.id);
                     this.notify();
                  });
               },
            })
         );

         this.notify();
      });

      this.hook(notifd, "resolved", (_, id: number) => {
         this.map.delete(id);
         this.notify();
      });
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Gtk.Widget[]) => void): () => void {
      return this.var.subscribe(callback);
   }

   destroy(): void {
      super.destroy();
      this.var.drop();
   }

   private notify(): void {
      this.var.set([...this.map.values()].reverse());
   }
}
