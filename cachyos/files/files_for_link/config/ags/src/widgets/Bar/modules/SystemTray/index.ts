import { Gtk, Widget } from "astal/gtk3";
import { TrayItemMap } from "./TrayItemMap";

// TODO: maybe fallback gicon?
const trayItemMap = new TrayItemMap();

export default function (): Widget.Box {
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
