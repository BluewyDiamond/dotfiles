import { App, Astal, hook, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { setupAsPanelButton as setupAsPanelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";

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

                     IconWithLabelFallback({ iconName: icons.notifications.normal })
                  ),
               ];

               self.visible = true;
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

                     IconWithLabelFallback({ iconName: "notifications" })
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
