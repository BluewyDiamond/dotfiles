import { App, Gtk, hook, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";

const notifd = Notifd.get_default();

export default function (): Gtk.Button {
   return Widget.Button({
      cssClasses: ["notifications"],

      onClicked: () => App.toggle_window("astal-notifications-overview"),

      setup: (self) => {
         function onNotificationsChanged() {
            if (notifd.notifications.length > 0) {
               self.child = IconWithLabelFallback({
                  icon: icons.notifications.noisy,
               });
            } else {
               self.child = IconWithLabelFallback({
                  icon: icons.notifications.normal,
               });
            }
         }

         onNotificationsChanged();

         hook(self, notifd, "notify::notifications", () =>
            onNotificationsChanged()
         );
      },
   });
}
