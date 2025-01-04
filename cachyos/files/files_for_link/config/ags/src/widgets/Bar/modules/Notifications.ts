import { Widget } from "astal/gtk3";
import { App } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { setupAsPanelButton as setupAsPanelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";

const notifd = Notifd.get_default();

export default function (): Widget.Box {
   return new Widget.Box({
      className: "notifications",

      setup: (self) => {
         function onNotificationsChanged() {
            if (notifd.notifications.length > 0) {
               self.children = [
                  new Widget.Button(
                     {
                        onClick: () => {
                           App.toggle_window("astal-notifications-overview");
                        },

                        setup: (self) => {
                           setupAsPanelButton(
                              self,
                              "astal-notifications-overview"
                           );
                        },
                     },

                     IconWithLabelFallback({ icon: "notification-active" })
                  ),
               ];

               self.visible = true;
            } else {
               self.children = [
                  new Widget.Button(
                     {
                        onClick: () => {
                           App.toggle_window("astal-notifications-overview");
                        },

                        setup: (self) => {
                           setupAsPanelButton(
                              self,
                              "astal-notifications-overview"
                           );
                        },
                     },

                     IconWithLabelFallback({ icon: "notifications" })
                  ),
               ];
            }
         }

         onNotificationsChanged();

         self.hook(notifd, "notify::notifications", () =>
            onNotificationsChanged()
         );
      },
   });
}
