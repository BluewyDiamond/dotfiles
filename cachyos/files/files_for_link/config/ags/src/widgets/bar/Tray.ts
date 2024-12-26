import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk, Widget } from "astal/gtk3";
import Tray from "gi://AstalTray";

// TODO: maybe fallback gicon?

export default function (): Widget.Box {
   const trayItemWidgets = new TrayItemWidgets();

   return new Widget.Box({
      className: "tray",

      setup: (self) => {
         updateItems(trayItemWidgets.get());

         trayItemWidgets.subscribe((list) => {
            updateItems(list);
         });

         function updateItems(items: Gtk.Widget[]) {
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

class TrayItemWidgets implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = new Variable([]);

   constructor() {
      const tray = Tray.get_default();

      tray.get_items()?.forEach((item) => {
         this.set(item.get_item_id(), TrayButton(item, tray));
      });

      tray.connect("item-added", (_, item_id) => {
         const item = tray.get_item(item_id);
         this.set(item_id, TrayButton(item, tray));
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

function TrayButton(item: Tray.TrayItem, tray: Tray.Tray): Widget.MenuButton {
   return new Widget.MenuButton(
      {
         setup: (self) => {
            setProperties(item);

            self.hook(item, "changed", () => {
               const changedItem = tray.get_item(item.get_item_id());
               setProperties(changedItem);
            });

            function setProperties(item: Tray.TrayItem) {
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
