import { Astal, Gtk, Widget } from "astal/gtk4";
import { ClientMap } from "./ClientMap";

export default function (): Astal.Box {
   // looks like the same widget can't be shared
   // in different boxes or other widgets
   // so each new instance needs their own instance of clientMap
   const clientMap = new ClientMap();

   return Widget.Box({
      cssClasses: ["hyprland-taskbar"],

      setup: (self) => {
         function onClientsChanged(list: Gtk.Widget[]) {
            if (list.length > 0) {
               self.visible = true;
               self.children = list;
            } else {
               self.visible = false;
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
