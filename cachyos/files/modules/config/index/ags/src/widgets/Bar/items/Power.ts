import { App, Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";
import { setupAsPanelButton } from "../../functions";

export default (): Gtk.Button => {
   return Widget.Button(
      {
         cssClasses: ["power"],

         onClicked: () => {
            App.toggle_window("astal-power-menu");
         },

         setup: (self) => {
            setupAsPanelButton(self, "astal-power-menu");
         },
      },

      IconWithLabelFallback({ iconName: icons.powermenu.shutdown })
   );
};
