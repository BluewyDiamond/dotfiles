import { Astal, Gtk, Widget } from "astal/gtk4";
import { ClientArray } from "./ClientArray";

export default function (): Astal.Box {
   // looks like the same widget can't be shared
   // in different boxes or other widgets
   // so each new instance needs their own instance of clientMap
   const clientMap = new ClientArray();

   return Widget.Box({
      cssClasses: ["taskbar"],

      setup: (self) => {
         function onClientsChanged(list: Gtk.Widget[]) {
            if (list.length > 0) {
               self.children = list;
               if (!self.visible) self.visible = true;
            } else {
               if (self.visible) self.visible = false;
            }
         }

         onClientsChanged(clientMap.get());

         clientMap.subscribe((list) => {
            onClientsChanged(list);
         });
      },

      onDestroy: () => {
         clientMap.destroy();
      },
   });
}
