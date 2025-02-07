import Hookable from "../../../../libs/services/Hookable";
import { Variable } from "astal";
import type { Subscribable } from "astal/binding";
import { type Gtk, hook, Widget } from "astal/gtk4";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

function TrayItemMenuButton(item: Tray.TrayItem): Gtk.MenuButton {
   return Widget.MenuButton(
      {
         setup: (self) => {
            const onItemChanged = (item: Tray.TrayItem): void => {
               const { tooltipMarkup, actionGroup, menuModel } = item;

               self.tooltipMarkup = tooltipMarkup;
               self.insert_action_group("dbusmenu", actionGroup);
               self.menuModel = menuModel;
            };

            onItemChanged(item);

            hook(self, item, "notify::gicon", () => {
               onItemChanged(tray.get_item(item.get_item_id()));
            });

            hook(self, self, "notify::active", () => {
               if (self.active) {
                  self.cssClasses = [...self.cssClasses, "active"];
               } else {
                  self.cssClasses = self.cssClasses.filter(
                     (className) => className !== "active"
                  );
               }
            });
         },
      },

      Widget.Image({
         gicon: item.gicon,

         setup: (self) => {
            hook(self, item, "changed", () => {
               const changedItem = tray.get_item(item.get_item_id());
               const { gicon } = changedItem;
               self.gicon = gicon;
            });
         },
      })
   );
}

export class TrayItemMap extends Hookable implements Subscribable {
   private readonly map: Map<string, Gtk.Widget> = new Map<
      string,
      Gtk.Widget
   >();

   private readonly variable: Variable<Gtk.Widget[]> = new Variable<
      Gtk.Widget[]
   >([]);

   constructor() {
      super();

      tray.get_items().forEach((item) => {
         this.map.set(item.get_item_id(), TrayItemMenuButton(item));
         this.notify();
      });

      this.hook(tray, "item-added", (_, itemId: string) => {
         const item = tray.get_item(itemId);
         this.map.set(itemId, TrayItemMenuButton(item));
         this.notify();
      });

      this.hook(tray, "item-removed", (_, itemId: string) => {
         this.map.delete(itemId);
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

   private notify(): void {
      this.variable.set([...this.map.values()]);
   }
}
