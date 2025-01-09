import { Gtk, Widget } from "astal/gtk3";
import { ClientMap } from "./ClientMap";

export default function (): Widget.Box {
   // looks like the same widget can't be shared
   // in different boxes or other widgets
   // so each new instance needs their own instance of clientMap
   const clientMap = new ClientMap();

   return new Widget.Box({
      className: "hyprland-taskbar",

      setup: (self) => {
         onClientsChanged(clientMap.get());

         clientMap.subscribe((list) => {
            onClientsChanged(list);
         });

         function onClientsChanged(list: Gtk.Widget[]) {
            if (list.length > 0) {
               self.visible = true;
               self.children = list;
            } else {
               self.visible = false;
            }
         }
      },

      onDestroy: () => {
         clientMap.destroy();
      },
   });
}
