import { App, Widget } from "astal/gtk3";
import { panelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";
import { GLib } from "astal";

export default function (): Widget.Button {
   return new Widget.Button(
      {
         className: "app-launcher-b",

         onClick: () => {
            App.toggle_window("astal-app-launcher");
         },

         setup: (self) => {
            panelButton(self, "astal-app-launcher");
         },
      },

      IconWithLabelFallback({ icon: GLib.get_os_info("LOGO") || "" })
   );
}
