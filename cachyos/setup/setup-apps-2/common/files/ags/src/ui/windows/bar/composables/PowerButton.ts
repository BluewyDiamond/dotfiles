import { App, type Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../../composables/IconWithLabelFallback";
import icons from "../../../../libs/icons";
import { onWindowVisible } from "../../../../utils/widget";

export default (): Gtk.Button =>
   Widget.Button(
      {
         cssClasses: ["bar-item-power"],

         onClicked: () => {
            App.toggle_window("astal-power-menu");
         },

         setup: (self) => {
            onWindowVisible("astal-power-menu", self);
         },
      },

      IconWithLabelFallback({ iconName: icons.powermenu.shutdown.symbolic })
   );
