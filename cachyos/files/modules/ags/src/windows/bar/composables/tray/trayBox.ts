import { type Astal, type Gtk, Widget } from "astal/gtk4";
import { TrayItemMap } from "./TrayItemMap";

// TODO: maybe fallback gicon?

export default function (): Astal.Box {
   const trayItemMap = new TrayItemMap();

   return Widget.Box({
      cssClasses: ["bar-item-tray"],

      setup: (self) => {
         const onTrayItemsChanged = (items: Gtk.Widget[]): void => {
            if (items.length > 0) {
               self.children = items;
               self.visible = true;
            } else {
               self.children = [];
               self.visible = false;
            }
         };

         onTrayItemsChanged(trayItemMap.get());

         trayItemMap.subscribe((list) => {
            onTrayItemsChanged(list);
         });
      },

      onDestroy: () => {
         trayItemMap.destroy();
      },
   });
}
