import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk, Widget } from "astal/gtk3";
import Tray from "gi://AstalTray";

// TODO: maybe fallback gicon?

export default function (): Widget.Box {
   const trayItemMap = new TrayItemMap();

   return new Widget.Box({
      className: "system-tray",

      setup: (self) => {
         onTrayItemsChanged(trayItemMap.get());

         trayItemMap.subscribe((list) => {
            onTrayItemsChanged(list);
         });

         function onTrayItemsChanged(items: Gtk.Widget[]) {
            if (items.length > 0) {
               self.children = items;
               self.visible = true;
            } else {
               self.children = [];
               self.visible = false;
            }
         }
      },
   });
}

class TrayItemMap implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = new Variable([]);

   constructor() {
      const tray = Tray.get_default();

      tray.get_items()?.forEach((item) => {
         this.set(item.get_item_id(), TrayItemButton(item, tray));
      });

      tray.connect("item-added", (_, item_id) => {
         const item = tray.get_item(item_id);
         this.set(item_id, TrayItemButton(item, tray));
      });

      tray.connect("item-removed", (_, item_id) => {
         this.delete(item_id);
      });
   }

   private notify() {
      this.var.set([...this.map.values()]);
   }

   private set(key: string, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: string) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
   }
}

function TrayItemButton(
   item: Tray.TrayItem,
   tray: Tray.Tray
): Widget.MenuButton {
   return new Widget.MenuButton(
      {
         className: "tray-item",

         setup: (self) => {
            onItemChanged(item);

            self.hook(item, "changed", () => {
               onItemChanged(tray.get_item(item.get_item_id()));
            });

            self.connect("toggled", () => {
               if (self.active) {
                  self.toggleClassName("active", true);
               } else {
                  self.toggleClassName("active", false);
               }
            });

            function onItemChanged(item: Tray.TrayItem) {
               self.tooltipMarkup = item.tooltipMarkup;
               self.usePopover = false;
               // @ts-ignore
               self.actionGroup = ["dbusmenu", item.actionGroup];
               self.menuModel = item.menuModel;
            }
         },
      },

      new Widget.Icon({
         gicon: item.gicon,

         setup: (self) => {
            self.hook(item, "changed", () => {
               const changedItem = tray.get_item(item.get_item_id());
               self.gicon = changedItem.gicon;
            });
         },
      })
   );
}
