import Hookable from "../../../../libs/services/Hookable";
import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Astal, Gtk, hook, Widget } from "astal/gtk4";
import Tray from "gi://AstalTray";

const tray = Tray.get_default();

function TrayItemButton(item: Tray.TrayItem): Gtk.MenuButton {
   return Widget.MenuButton(
      {
         setup: (self) => {
            function onItemChanged(item: Tray.TrayItem) {
               self.tooltipMarkup = item.tooltipMarkup;
               // @ts-ignore
               self.actionGroup = ["dbusmenu", item.actionGroup];
               self.menuModel = item.menuModel;
            }

            onItemChanged(item);

            hook(self, item, "changed", () => {
               onItemChanged(tray.get_item(item.get_item_id()));
            });

            hook(self, self, "activate", () => {
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
               self.gicon = changedItem.gicon;
            });
         },
      })
   );
}

export class TrayItemMap2 extends Hookable implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = new Variable([]);

   constructor() {
      super();

      tray.get_items()?.forEach((item) => {
         this.set(item.get_item_id(), TrayItemButton(item));
      });

      this.hook(tray, "item-added", (_, item_id) => {
         const item = tray.get_item(item_id);
         this.set(item_id, TrayItemButton(item));
      });

      this.hook(tray, "item-removed", (_, item_id) => {
         this.delete(item_id);
      });
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
   }

   destroy() {
      super.destroy();
      this.var.drop();
   }

   private set(key: string, value: Gtk.Widget) {
      //this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: string) {
      //this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }

   private notify() {
      this.var.set([...this.map.values()]);
   }
}
