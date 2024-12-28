import { Gtk, Widget } from "astal/gtk3";
import { NotificationWidgets } from "../../states";
import { IconWithLabelFallback } from "../wrappers";
import icons from "../../libs/icons";

export default function (): Widget.Box {
   const notificationWidgets = new NotificationWidgets();

   return new Widget.Box({
      className: "notifications",

      setup: (self) => {
         update(notificationWidgets.get());

         notificationWidgets.subscribe((list) => {
            update(list);
         });

         function update(list: Gtk.Widget[]) {
            if (list.length > 0) {
               self.children = [
                  IconWithLabelFallback(icons.notifications.message),
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
