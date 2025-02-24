import { App, type Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/iconWithLabelFallback";
import icons from "../../../libs/icons";
import { onWindowVisible } from "../../../utils/widget";

export default (): Gtk.Button =>
   Widget.Button(
      {
         cssClasses: ["power"],

         onClicked: () => {
            App.toggle_window("astal-power-menu");
         },

         setup: (self) => {
            onWindowVisible("astal-power-menu", self);
         },
      },

      IconWithLabelFallback({ icon: icons.powermenu.shutdown })
   );
