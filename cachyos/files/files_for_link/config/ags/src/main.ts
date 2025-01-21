import { App, Astal, Widget } from "astal/gtk4";
import Bar from "./widgets/Bar";
import { getCss } from "./utils/style";
import AppLauncher from "./widgets/AppLauncher";
import NotificationsOverview from "./widgets/NotificationsOverview";
import NotificationsPopup from "./widgets/NotificationsPopup";
import PowerMenu from "./widgets/PowerMenu";
//import NotificationsOverview from "./widgets/NotificationsOverview";
//import NotificationsPopup from "./widgets/NotificationsPopup";
//import AppLauncher from "./widgets/AppLauncher";
//import PowerMenu from "./widgets/PowerMenu";

App.start({
   css: getCss(),
   instanceName: "main",

   main() {
      let bar: Astal.Window | undefined;
      let notificationsOverview: Astal.Window | undefined;
      let notificationsPopup: Astal.Window | undefined;
      let appLauncher: Astal.Window | undefined;
      let powerMenu: Astal.Window | undefined;

      function onMonitorsChanged() {
         bar?.destroy();
         notificationsOverview?.destroy();
         notificationsPopup?.destroy();
         appLauncher?.destroy();
         powerMenu?.destroy();

         bar = undefined;
         notificationsOverview = undefined;
         //notificationsPopup = undefined;
         appLauncher = undefined;
         //powerMenu = undefined;

         const monitors = App.get_monitors();

         if (!monitors) {
            return;
         }

         for (const monitor of monitors) {
            if (!monitor) {
               continue;
            }

            bar = Bar(monitor);
            notificationsOverview = NotificationsOverview(monitor);
            notificationsPopup = NotificationsPopup(monitor);
            appLauncher = AppLauncher(monitor);
            powerMenu = PowerMenu(monitor);

            App.add_window(notificationsOverview);
            App.add_window(notificationsPopup);
            App.add_window(appLauncher);
            App.add_window(powerMenu);
         }
      }

      onMonitorsChanged();

      App.connect("notify::monitors", () => {
         onMonitorsChanged();
      });
   },
});
