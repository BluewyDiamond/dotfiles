import { App, Widget } from "astal/gtk3";
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
      let bar: Widget.Window;
      let notificationsOverview: Widget.Window;
      let notificationsPopup: Widget.Window;
      let appLauncher: Widget.Window;
      let powerMenu: Widget.Window;

      function onMonitorsChanged() {
         // possibly this is done automatically by gc?
         // idk
         bar?.destroy();
         notificationsOverview?.destroy();
         notificationsPopup?.destroy();
         appLauncher?.destroy();
         powerMenu?.destroy();

         const monitors = App.get_monitors();

         if (!monitors) {
            return;
         }

         for (const monitor of monitors) {
            if (!monitor) {
               return;
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
