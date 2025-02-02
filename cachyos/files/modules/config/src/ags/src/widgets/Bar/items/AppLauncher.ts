import { App, Gtk, Widget } from "astal/gtk4";
import { setupAsPanelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import { GLib } from "astal";
import { createIcon } from "../../../libs/icons";

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["app-launcher"],

         onClicked: () => {
            App.toggle_window("astal-app-launcher");
         },

         setup: (self) => {
            setupAsPanelButton(self, "astal-app-launcher");
         },
      },

      IconWithLabelFallback({ icon: createIcon(GLib.get_os_info("LOGO") || "" )})
   );
}
