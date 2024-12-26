import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Gtk, Widget } from "astal/gtk3";
import Tray from "gi://AstalTray";

// TODO: gicon fallback

export default function (): Widget.Box {
   const trayItemWidgets = new TrayItemWidgets();

   return new Widget.Box({
      className: "tray",

      setup: (self) => {
         self.children = trayItemWidgets.get();

         trayItemWidgets.subscribe((list) => {
            self.children = list;
         });
      },
   });
}

class TrayItemWidgets implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = new Variable([]);

   constructor() {
      const tray = Tray.get_default();

      tray.get_items()?.forEach((item) => {
         this.set(item.get_item_id(), TrayButton(item));
         console.log(`init: ${item.get_item_id()}`);
      });

      tray.connect("item-added", (_, item_id) => {
         const item = tray.get_item(item_id);
         const indexOfSlash = item_id.indexOf("/");
         const curatedItemId =
            indexOfSlash !== -1 ? item_id.substring(0, indexOfSlash) : item_id;

         this.set(curatedItemId, TrayButton(item));
      });

      tray.connect("item-removed", (_, item_id) => {
         this.delete(item_id);
         console.log(`removed: ${item_id}`);
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
      const r = this.map.delete(key);
      for (const [key, value] of this.map) {
         console.log(`content => ${key} | ${value}`);
      }
      console.log(`delete result: ${r}`);
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
