import { App, type Gtk, Widget } from "astal/gtk4";
import { IndicatorsEfficientRenderingMap } from "./IndicatorsEfficientRenderingMap";
import options from "../../../../../options";
import { onWindowVisible } from "../../../../../utils/widget";

export default function (): Gtk.Button {
   const indicatorsMap = new IndicatorsEfficientRenderingMap();

   return Widget.Button(
      {
         cssClasses: ["bar-item", "bar-item-indicators"],

         onClicked: () => {
            App.toggle_window(options.controlCenter.name);
         },

         setup: (self) => {
            onWindowVisible(options.controlCenter.name, self);
         },
      },

      Widget.Box({
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
      })
   );
}
