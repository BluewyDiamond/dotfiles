import { type Gtk, Widget } from "astal/gtk4";
import { IndicatorsEfficientRenderingMap } from "./IndicatorsEfficientRenderingMap";

export default function (): Gtk.Button {
   const indicatorsMap = new IndicatorsEfficientRenderingMap();

   return Widget.Button({
      cssClasses: ["bar-item", "bar-item-indicators"],

      child: Widget.Box({
         setup: (self) => {
            const onIndicatorsChanged = (list: Gtk.Widget[]): void => {
               if (list.length > 0) {
                  self.children = list;
                  self.visible = true;
               } else {
                  self.children = [];
                  self.visible = false;
               }
            };

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
