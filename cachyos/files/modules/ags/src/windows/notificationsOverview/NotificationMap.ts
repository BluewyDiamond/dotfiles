import { Variable } from "astal";
import type { Subscribable } from "astal/binding";
import type { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/notification";
import Trackable from "../../libs/services/Trackable";
import options from "../../options";

const notifd = Notifd.get_default();

export class NotificationMap extends Trackable implements Subscribable {
   private readonly map: Map<number, Gtk.Widget> = new Map<
      number,
      Gtk.Widget
   >();

   private readonly variable: Variable<Gtk.Widget[]> = Variable([]);

   constructor() {
      super();

      notifd.notifications.forEach((notification) => {
         this.map.set(notification.id, Notification({ notification }));

         this.notify();
      });

      this.hook(notifd, "notified", (_, id: number) => {
         const notification = notifd.get_notification(id);
         this.map.set(id, Notification({ notification }));
         this.notify();
      });

      this.hook(notifd, "resolved", (_, id: number) => {
         this.map.delete(id);
         this.notify();
      });
   }

   get(): Gtk.Widget[] {
      return this.variable.get();
   }

   subscribe(callback: (list: Gtk.Widget[]) => void): () => void {
      return this.variable.subscribe(callback);
   }

   destroy(): void {
      super.destroy();
      this.variable.drop();
   }

   async clear(): Promise<void> {
      for (const [key, _] of this.map) {
         notifd.get_notification(key).dismiss();

         await new Promise((resolve) => {
            setTimeout(resolve, options.rapidTimeout);
         });
      }
   }

   private notify(): void {
      this.variable.set([...this.map.values()].reverse());
   }
}
