import { App, Widget } from "astal/gtk3";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";

export default (): Widget.Button => {
   return new Widget.Button(
      {
         className: "power",

         onClick: () => {
            App.toggle_window("astal-power-menu");
         },
      },
      IconWithLabelFallback({ icon: icons.powermenu.shutdown })
   );
};
