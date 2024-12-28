import { Gtk, Widget } from "astal/gtk3";
import { IconWithLabelFallback } from "../wrappers";
import icons from "../../libs/icons";
import { App } from "astal/gtk3";
import { bind, Variable } from "astal";
import { Subscribable } from "astal/binding";
import Notifd from "gi://AstalNotifd";

export default function (): Widget.Button {
   const notifd = Notifd.get_default();

   return new Widget.Button({
      className: "notifications",

      onClick: () => {
         App.toggle_window("astal-notifications-overview");
      },

      setup: (self) => {
         update();

         self.hook(notifd, "notify::notifications", () => {
            update();
         });

         function update() {
            if (notifd.notifications.length > 0) {
               self.child = IconWithLabelFallback(icons.notifications.message, {});
               self.visible = true;
            } else {
               self.child?.destroy();
               self.visible = false;
            }
         }
      },
   });
}
