import { App, type Gtk, hook, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { IconWithLabelFallback } from "../../composables/iconWithLabelFallback";
import icons from "../../../libs/icons";

const notifd = Notifd.get_default();

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["bar-item", "bar-item-notifications"],

         onClicked: () => {
            App.toggle_window("astal-notifications-overview");
         },

         setup: (self) => {
            const onNotificationsChanged = (): void => {
               if (notifd.notifications.length > 0) {
                  self.visible = true;
               } else {
                  self.visible = false;
               }
            };

            onNotificationsChanged();

            hook(self, notifd, "notify::notifications", () => {
               onNotificationsChanged();
            });
         },
      },

      IconWithLabelFallback({
         icon: icons.notifications.noisy,
      })
   );
}
