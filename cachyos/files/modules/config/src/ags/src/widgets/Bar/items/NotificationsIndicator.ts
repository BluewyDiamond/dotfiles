import { App, Astal, hook, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { setupAsPanelButton as setupAsPanelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";

const notifd = Notifd.get_default();

export default function (): Astal.Box {
   return Widget.Box({
      cssClasses: ["notifications"],

      setup: (self) => {
         function onNotificationsChanged() {
            if (notifd.notifications.length > 0) {
               self.children = [
                  Widget.Button(
                     {
                        onClicked: () => {
                           App.toggle_window("astal-notifications-overview");
                        },

                        setup: (self) => {
                           setupAsPanelButton(
                              self,
                              "astal-notifications-overview"
                           );
                        },
                     },

                     IconWithLabelFallback({
                        icon: icons.notifications.noisy,
                     })
                  ),
               ];
            } else {
               self.children = [
                  Widget.Button(
                     {
                        onClicked: () => {
                           App.toggle_window("astal-notifications-overview");
                        },

                        setup: (self) => {
                           setupAsPanelButton(
                              self,
                              "astal-notifications-overview"
                           );
                        },
                     },

                     IconWithLabelFallback({
                        icon: icons.notifications.normal,
                     })
                  ),
               ];
            }
         }

         onNotificationsChanged();

         hook(self, notifd, "notify::notifications", () =>
            onNotificationsChanged()
         );
      },
   });
}
