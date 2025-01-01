import { App } from "astal/gtk3";
import Bar from "./windows/Bar";
import { getCss } from "./style";
import NotificationsOverview from "./windows/NotificationsOverview";
import NotificationsPopup from "./windows/NotificationsPopup";

App.start({
   css: getCss(),
   instanceName: "main",

   main() {
      onMonitorsChanged();

      App.connect("notify::monitors", () => {
         onMonitorsChanged();
      });

      function onMonitorsChanged() {
         App.get_monitors().forEach((monitor) => {
            Bar(monitor);
            App.add_window(NotificationsOverview(monitor));
            App.add_window(NotificationsPopup(monitor));
         });
      }
   },
});
