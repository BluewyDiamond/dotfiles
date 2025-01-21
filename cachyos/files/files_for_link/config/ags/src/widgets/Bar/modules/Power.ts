import { App, Widget } from "astal/gtk3";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";
import { setupAsPanelButton } from "../../functions";

export default (): Widget.Button => {
   return new Widget.Button(
      {
         className: "power",

         onClick: () => {
            App.toggle_window("astal-power-menu");
         },

         setup: (self) => {
            setupAsPanelButton(self, "astal-power-menu");
         },
      },
      IconWithLabelFallback({ icon: icons.powermenu.shutdown })
   );
};
