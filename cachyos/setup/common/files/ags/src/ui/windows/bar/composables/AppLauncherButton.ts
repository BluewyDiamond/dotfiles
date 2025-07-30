import { App, type Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../../composables/IconWithLabelFallback";
import { GLib } from "astal";
import { createIcon } from "../../../../libs/icons";
import options from "../../../../options";
import { onWindowVisible } from "../../../../utils/widget";

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["bar-item", "bar-item-app-launcher"],

         onClicked: () => {
            App.toggle_window(options.appLauncher.name);
         },

         setup: (self) => {
            onWindowVisible(options.appLauncher.name, self);
         },
      },

      IconWithLabelFallback({
         iconName: GLib.get_os_info("LOGO") ?? "",
      })
   );
}
