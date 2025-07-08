import { type Astal, type Gtk, Widget } from "astal/gtk4";
import { TrayItemsEfficientRendering } from "./TrayItemsEfficientRendering";

// TODO: maybe fallback gicon?

export default function (): Astal.Box {
   const trayItemsEfficientRendering = new TrayItemsEfficientRendering();

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

         onTrayItemsChanged(trayItemsEfficientRendering.get());

         trayItemsEfficientRendering.subscribe((list) => {
            onTrayItemsChanged(list);
         });
      },

      onDestroy: () => {
         trayItemsEfficientRendering.destroy();
      },
   });
}
