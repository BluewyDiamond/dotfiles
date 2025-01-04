import { Gtk, Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import { IconWithLabelFallback } from "../../../wrappers/IconWithLabelFallback";
import { ClientMap } from "./ClientMap";

export default function (): Widget.Box {
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
   });
}
