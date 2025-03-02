import { Variable } from "astal";
import type { Subscribable } from "astal/binding";
import { Widget, type Astal, type Gtk } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../composables/notificationBox";
import Hookable from "../../libs/services/Hookable";
import options from "../../options";

const notifd = Notifd.get_default();

export class NotificationPagesMap extends Hookable implements Subscribable {
   private readonly notificationsMap: Map<number, Gtk.Widget> = new Map<
      number,
      Gtk.Widget
   >();

   private readonly pagesMap: Map<number, Astal.Box> = new Map<
      number,
      Astal.Box
   >();

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

   async clear(): Promise<void> {
      this.notificationsMap.clear();
      this.pagesMap.clear();
      this.variable.set([]);
   }

   private init(): void {
      notifd.notifications.forEach((notification) => {
         this.notificationsMap.set(
            notification.id,
            Notification({ notification })
         );
      });

      this.hook(notifd, "notified", (_, id: number) => {
         const notification = notifd.get_notification(id);
         this.notificationsMap.set(id, Notification({ notification }));
         this.notify();
      });

      this.hook(notifd, "resolved", (_, id: number) => {
         this.notificationsMap.delete(id);
         this.notify();
      });
   }

   private notify(): void {
      this.pagesMap.forEach((page) => {
         page.children = [];
      });

      let pageIndex = 0;
      let currentPage = this.pagesMap.get(pageIndex);

      for (const [_, notification] of Array.from(
         this.notificationsMap.entries()
      ).reverse()) {
         if (
            currentPage === undefined ||
            currentPage.get_children().length >=
               options.controlCenter.maxNotificationsPerPage
         ) {
            pageIndex++;
            currentPage = this.pagesMap.get(pageIndex);

            if (currentPage === undefined) {
               currentPage = Widget.Box({ vertical: true });
               this.pagesMap.set(pageIndex, currentPage);
            }
         }

         currentPage.append(notification);
      }

      const requiredPages = Math.ceil(
         this.notificationsMap.size /
            options.controlCenter.maxNotificationsPerPage
      );

      while (this.pagesMap.size > requiredPages) {
         const lastPageIndex = this.pagesMap.size - 1;
         this.pagesMap.delete(lastPageIndex);
      }

      const pages = Array.from(this.pagesMap.values());
      this.variable.set(pages);
   }
}
