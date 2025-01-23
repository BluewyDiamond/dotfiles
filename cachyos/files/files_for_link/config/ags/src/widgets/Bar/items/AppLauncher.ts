import { App, Gtk, Widget } from "astal/gtk4";
import { setupAsPanelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import { GLib } from "astal";

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["app-launcher-b"],

         onClicked: () => {
            App.toggle_window("astal-app-launcher");
         },

         setup: (self) => {
            setupAsPanelButton(self, "astal-app-launcher");
         },
      },

      IconWithLabelFallback({ iconName: GLib.get_os_info("LOGO") || "" })
   );
}
