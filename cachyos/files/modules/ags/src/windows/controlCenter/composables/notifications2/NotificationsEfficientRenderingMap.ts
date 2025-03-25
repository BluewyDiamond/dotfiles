import { Gtk } from "astal/gtk4";
import { EfficientRenderingMap } from "../../../../libs/efficientRendering";
import Trackable from "../../../../libs/Trackable";
import Notifd from "gi://AstalNotifd";
import Notification from "../../../composables/notification";
import options from "../../../../options";

const notifd = Notifd.get_default();

export class NotificationsEfficientRenderingMap extends EfficientRenderingMap<
   number,
   Gtk.Widget,
   Gtk.Widget
> {
   private readonly trackable = new Trackable();

   constructor() {
      super();
      this.init();
   }

   async clear(): Promise<void> {
      for (const [key, _] of this.map) {
         notifd.get_notification(key).dismiss();

         await new Promise((resolve) => {
            setTimeout(resolve, options.general.rapidTimeout);
         });
      }
   }

   destroy(): void {
      super.destroy();
      this.trackable.destroy();
   }

   protected notify(): void {
      this.variable.set([...this.map.values()].reverse());
   }

   protected init(): void {
      notifd.notifications.forEach((notification) => {
         this.map.set(notification.id, Notification({ notification }));
         this.notify();
      });

      this.trackable.track([
         notifd.connect("notified", (_, id: number) => {
            const notification = notifd.get_notification(id);
            this.map.set(id, Notification({ notification }));
            this.notify();
         }),

         notifd,
      ]);

      this.trackable.track([
         notifd.connect("resolved", (_, id: number) => {
            this.map.delete(id);
            this.notify();
         }),

         notifd,
      ]);
   }
}
