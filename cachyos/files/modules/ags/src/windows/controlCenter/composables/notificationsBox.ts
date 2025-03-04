import { Variable } from "astal";
import { Widget, type Astal, type Gtk, hook } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "../../composables/notification";
import Hookable from "../../../libs/services/Hookable";
import options from "../../../options";

const notifd = Notifd.get_default();

export function notificationsBox(): Astal.Box {
   const notificationsMap: Map<number, Gtk.Widget> = new Map<
      number,
      Gtk.Widget
   >();

   const pagesMap: Map<number, Astal.Box> = new Map<number, Astal.Box>();
   const pagesVariable: Variable<Gtk.Widget[]> = Variable([]);

   const stack = Widget.Stack({
      setup: (self) => {
         function onPagesVariableChanged(list: Gtk.Widget[]): void {
            list.forEach((item, index) => {
               self.add_named(item, index.toString());
            });
         }

         onPagesVariableChanged(pagesVariable.get());

         pagesVariable.subscribe((list) => {
            onPagesVariableChanged(list);
         });
      },
   });

   const update = (): void => {
      pagesMap.forEach((page) => {
         page.children = [];
         stack.remove(page);
      });

      let pageIndex = 0;
      let currentPage = pagesMap.get(pageIndex);

      for (const [_, notification] of Array.from(
         notificationsMap.entries()
      ).reverse()) {
         if (
            currentPage === undefined ||
            currentPage.get_children().length >=
               options.controlCenter.maxNotificationsPerPage
         ) {
            pageIndex++;
            currentPage = pagesMap.get(pageIndex);

            if (currentPage === undefined) {
               currentPage = Widget.Box({ vertical: true });
               pagesMap.set(pageIndex, currentPage);
            }
         }

         currentPage.append(notification);
      }

      const requiredPages = Math.ceil(
         notificationsMap.size / options.controlCenter.maxNotificationsPerPage
      );

      if (pagesMap.size > requiredPages) {
         const lastPageIndex = pagesMap.size - 1;
         pagesMap.delete(lastPageIndex);
      }

      const pages = Array.from(pagesMap.values());
      pagesVariable.set(pages);
   };

   const store = new Hookable();

   const init = (): void => {
      notifd.notifications.forEach((notification) => {
         notificationsMap.set(notification.id, Notification({ notification }));
      });

      store.hook(notifd, "notified", (_, id: number) => {
         const notification = notifd.get_notification(id);
         notificationsMap.set(id, Notification({ notification }));
         update();
      });

      store.hook(notifd, "resolved", (_, id: number) => {
         notificationsMap.delete(id);
         update();
      });
   };

   init();

   return Widget.Box({
      vertical: true,

      setup: (self) => {
         self.append(stack);

         self.append(
            Widget.Box({
               setup: (self) => {
                  pagesVariable.subscribe((list) => {
                     self.children = [];

                     for (let index = 0; index < list.length; index++) {
                        self.append(
                           Widget.Button({
                              cssClasses: ["control-center-page-button"],
                              child: Widget.Label({ label: `${index}` }),

                              onClicked: () => {
                                 stack.set_visible_child_name(`${index}`);
                              },
                           })
                        );
                     }
                  });
               },
            })
         );
      },

      onDestroy: () => {
         store.destroy();
      },
   });
}
