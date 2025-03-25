import { timeout } from "astal";
import type { Subscribable } from "astal/binding";
import type { Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/notification";
import options from "../../options";
import { EfficientRenderingMap } from "../../libs/efficientRendering";
import Trackable from "../../libs/Trackable";

const notifd = Notifd.get_default();

export class NotificationsEfficientRenderingMap
   extends EfficientRenderingMap<number, Gtk.Widget, Gtk.Widget>
   implements Subscribable
{
   private readonly trackable = new Trackable();

   constructor() {
      super();
      void this.init();
   }

   destroy(): void {
      super.destroy();
      this.trackable.destroy();
   }

   protected notify(): void {
      this.variable.set([...this.map.values()].reverse());
   }

   private async init(): Promise<void> {
      const capNotifications = (): void => {
         if (this.map.size >= options.notificationsPopup.maxItems) {
            const [key] = this.map.entries().next().value ?? [];
            if (key === undefined) return;
            this.map.delete(key);
            this.notify();
         }
      };

      const setNotification = (notification: Notifd.Notification): void => {
         this.map.set(
            notification.id,

            Notification({
               notification: notifd.get_notification(notification.id),

               setup: () => {
                  if (
                     notification.urgency !== Notifd.Urgency.CRITICAL &&
                     typeof options.notificationsPopup.timeout === "number"
                  ) {
                     timeout(options.notificationsPopup.timeout, () => {
                        this.map.delete(notification.id);
                        this.notify();
                     });
                  }
               },
            })
         );

         this.notify();
      };

      for (const notification of notifd.notifications) {
         capNotifications();
         setNotification(notification);

         await new Promise((resolve) =>
            setTimeout(resolve, options.general.rapidTimeout)
         );
      }

      this.trackable.track([
         notifd.connect("notified", (_, id: number) => {
            const notification = notifd.get_notification(
               id
            ) as Notifd.Notification | null;

            if (notification === null) {
               return;
            }

            capNotifications();
            setNotification(notification);
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
