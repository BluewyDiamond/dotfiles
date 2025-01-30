import { Astal, Gtk, Widget } from "astal/gtk4";
import { IndicatorMap } from "./IndicatorMap";

export default function (): Astal.Button {
   const indicatorsMap = new IndicatorMap();

   return Widget.Button({
      cssClasses: ["indicators"],

      child:  Widget.Box({
         setup: (self) => {
            function onIndicatorsChanged(list: Gtk.Widget[]) {
               if (list.length > 0) {
                  self.children = list;
                  self.visible = true;
               } else {
                  self.children = [];
                  self.visible = false;
               }
            }

            onIndicatorsChanged(indicatorsMap.get());

            indicatorsMap.subscribe((list) => {
               onIndicatorsChanged(list);
            });
         },

         onDestroy: () => {
            indicatorsMap.destroy();
         },
      }),
   });
}
