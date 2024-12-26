import { Widget } from "astal/gtk3";
import { NotificationWidgets } from "../../states";
import { Icon } from "astal/gtk3/widget";
import { IconWithLabelFallback } from "../wrappers";
import icons from "../../libs/icons";

export default function (): Widget.Box {
   const notificationWidgets = new NotificationWidgets();

   return new Widget.Box({
      setup: (self) => {
         notificationWidgets.subscribe((list) => {
            if (list.length > 0) {
               self.children = [
                  IconWithLabelFallback(icons.notifications.message),
               ];

               self.visible = true;
            } else {
               self.children = [];
               self.visible = false;
            }
         });
      },
   });
}
