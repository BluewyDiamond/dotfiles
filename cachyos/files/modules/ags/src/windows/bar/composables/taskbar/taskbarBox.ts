import { type Astal, type Gtk, Widget } from "astal/gtk4";
import { ClientsEfficientRenderingArray } from "./ClientsEfficientRenderingArray";

export default function (): Astal.Box {
   // looks like the same widget can't be shared
   // in different boxes or other widgets
   // so each new instance needs their own instance of clientMap
   const clientMap = new ClientsEfficientRenderingArray();

   return Widget.Box({
      cssClasses: ["bar-item-taskbar"],

      setup: (self) => {
         const onClientsChanged = (list: Gtk.Widget[]): void => {
            if (list.length > 0) {
               self.children = list;
               self.visible ||= list.length > 0;
            } else {
               self.visible &&= list.length > 0;
            }
         };

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
