import { App } from "astal/gtk3";
import Bar from "./widgets/Bar";
import { getCss } from "./style";
import NotificationPopups from "./widgets/NotificationPopup";
import notificationsTray from "./widgets/NotificationsOverview";

App.start({
   css: getCss(),
   instanceName: "some_name",

   main() {
      App.get_monitors().map(Bar);
      App.get_monitors().map(NotificationPopups);

      for (const monitor of App.get_monitors()) {
         const w = notificationsTray(monitor);
         w.hide();
         App.add_window(w);
      }
   },
});
