import { Gtk, Widget } from "astal/gtk3";
import { ClientMap } from "./ClientMap";

const clientMap = new ClientMap();

export default function (): Widget.Box {
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
   });
}
