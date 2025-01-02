import { Widget } from "astal/gtk3";
import icons from "../../../libs/icons";
import { App } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { panelButton as setupAsPanelButton } from "../../functions";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";

export default function (): Widget.Box {
   const notifd = Notifd.get_default();

   return new Widget.Box({
      className: "notifications",

      setup: (self) => {
         update();

         self.hook(notifd, "notify::notifications", () => update());

         function update() {
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

                     IconWithLabelFallback(icons.notifications.message, {})
                  ),
               ];

               self.visible = true;
            } else {
               self.children = [];
               self.visible = false;
            }
         }
      },
   });
}
