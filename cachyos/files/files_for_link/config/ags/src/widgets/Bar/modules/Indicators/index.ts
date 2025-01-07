import { Gtk, Widget } from "astal/gtk3";
import { IndicatorMap } from "./IndicatorMap";

export default function (): Widget.Button {
   const indicatorsMap = new IndicatorMap();

   return new Widget.Button({
      className: "indicators",

      child: new Widget.Box({
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
      }),
   });
}
