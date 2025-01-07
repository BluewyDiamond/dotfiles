import { App } from "astal/gtk3";
import Bar from "./widgets/Bar";
import { getCss } from "./style";
import NotificationsOverview from "./widgets/NotificationsOverview";
import NotificationsPopup from "./widgets/NotificationsPopup";
import AppLauncher from "./widgets/AppLauncher";
import PowerMenu from "./widgets/PowerMenu";

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
            App.add_window(AppLauncher(monitor));
            App.add_window(PowerMenu(monitor));
         });
      }
   },
});
