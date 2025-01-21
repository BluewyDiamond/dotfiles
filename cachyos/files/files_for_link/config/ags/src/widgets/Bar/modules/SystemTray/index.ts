import { Astal, Gtk, Widget } from "astal/gtk4";
import { TrayItemMap as TrayItemMap } from "./TrayItemMap";

// TODO: maybe fallback gicon?

export default function (): Astal.Box {
   const trayItemMap = new TrayItemMap();

   return Widget.Box({
      cssClasses: ["system-tray"],

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

      onDestroy: () => {
         trayItemMap.destroy();
      },
   });
}
