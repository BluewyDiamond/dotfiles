import { App, Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";
import { onWindowVisible } from "../../functions";

export default (): Gtk.Button => {
   return Widget.Button(
      {
         cssClasses: ["power"],

         onClicked: () => {
            App.toggle_window("astal-power-menu");
         },

         setup: (self) => onWindowVisible( "astal-power-menu", self)
      },

      IconWithLabelFallback({ icon: icons.powermenu.shutdown })
   );
};
