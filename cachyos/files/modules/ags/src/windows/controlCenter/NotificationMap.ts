import { Variable } from "astal";
import type { Subscribable } from "astal/binding";
import { Widget, type Astal, type Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/notificationBox";
import Hookable from "../../libs/services/Hookable";
import options from "../../options";

const notifd = Notifd.get_default();

interface Page {
   box: Astal.Box;
   notifications: Map<number, Gtk.Widget>;
}

export class NotificationPagesMap extends Hookable implements Subscribable {
   private readonly pages: Map<number, Page> = new Map<number, Page>();
   private readonly variable: Variable<Gtk.Widget[]> = Variable([]);

   constructor() {
      super();
      this.init();
   }

   get(): Gtk.Widget[] {
      return this.variable.get();
   }

   subscribe(callback: (list: Gtk.Widget[]) => void): () => void {
      return this.variable.subscribe(callback);
   }

   async clear(): Promise<void> {}

   private init(): void {
      notifd.notifications.forEach((notification) => {
         this.set(notification.id, Notification({ notification }));
         this.notify();
      });

      this.hook(notifd, "notified", (_, id: number) => {
         const notification = notifd.get_notification(id);
         this.set(id, Notification({ notification }));
         this.notify();
      });

      this.hook(notifd, "resolved", (_, id: number) => {
         this.delete(id);
         this.notify();
      });
   }

   private notify(): void {
      this.pages.forEach((page) => {
         page.box.children = [];

         Array.from(page.notifications.values())
            .reverse()
            .forEach((notificationWidget) => {
               page.box.append(notificationWidget);
            });
      });

      const boxes: Gtk.Widget[] = Array.from(this.pages.values())
         .reverse()
         .map((page) => page.box);

      this.variable.set(boxes);
   }

   private set(notificationId: number, widget: Gtk.Widget): void {
      let foundedPage: null | Page = null;

      for (const [_, page] of this.pages) {
         if (
            page.notifications.size <
            options.controlCenter.maxNotificationsPerPage
         ) {
            foundedPage = page;
            break;
         }
      }

      if (foundedPage !== null) {
         foundedPage.notifications.set(notificationId, widget);
      } else {
         const newPage = {
            box: Widget.Box({
               cssClasses: ["control-center-notifications-page"],
               vertical: true,
            }),

            notifications: new Map(),
         };

         newPage.notifications.set(notificationId, widget);
         this.pages.set(this.pages.size + 1, newPage);
      }
   }

   private delete(notificationId: number): void {
      let foundedPage: null | [number, Page] = null;

      for (const [id, page] of this.pages) {
         if (page.notifications.has(notificationId)) {
            foundedPage = [id, page];
            break;
         }
      }

      if (foundedPage === null) return;
      foundedPage[1].notifications.delete(notificationId);

      if (foundedPage[1].notifications.size !== 0) {
         return;
      }

      this.pages.delete(foundedPage[0]);
   }
}
