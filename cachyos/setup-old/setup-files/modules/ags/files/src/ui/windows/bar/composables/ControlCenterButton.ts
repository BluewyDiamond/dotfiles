import { App, type Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../../composables/IconWithLabelFallback";
import options from "../../../../options";
import icons from "../../../../libs/icons";
import { onWindowVisible } from "../../../../utils/widget";

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["bar-item", "bar-item-control-center"],

         onClicked: () => {
            App.toggle_window(options.controlCenter.name);
         },

         setup: (self) => {
            onWindowVisible(options.controlCenter.name, self);
         },
      },

      IconWithLabelFallback({ iconName: icons.ui.info.symbolic })
   );
}
