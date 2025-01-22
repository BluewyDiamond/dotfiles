import { App, Astal, Gdk } from "astal/gtk4";
import Bar from "./widgets/Bar";
import { getCss } from "./utils/style";
import AppLauncher from "./widgets/AppLauncher";
import NotificationsOverview from "./widgets/NotificationsOverview";
import NotificationsPopup from "./widgets/NotificationsPopup";
import PowerMenu from "./widgets/PowerMenu";

App.start({
   css: getCss(),
   instanceName: "main",

   main() {
      const gdkDisplay = Gdk.Display.get_default();

      if (!gdkDisplay) {
         console.log("gdkDisplay is null...");
         return;
      }

      const monitorManager = gdkDisplay.get_monitors();

      let bar: Astal.Window | undefined;
      let notificationsOverview: Astal.Window | undefined;
      let notificationsPopup: Astal.Window | undefined;
      let appLauncher: Astal.Window | undefined;
      let powerMenu: Astal.Window | undefined;

      function onMonitorsChanged() {
         if (bar) {
            bar.destroy();
            bar = undefined;
         }

         // no need to call destroy cause
         // of remove window method call
         if (notificationsOverview) {
            App.remove_window(notificationsOverview);
            notificationsOverview = undefined;
         }

         if (notificationsPopup) {
            App.remove_window(notificationsPopup);
            notificationsPopup = undefined;
         }

         if (appLauncher) {
            App.remove_window(appLauncher);
            appLauncher = undefined;
         }

         if (powerMenu) {
            App.remove_window(powerMenu);
            powerMenu = undefined;
         }

         const numOfMonitors = monitorManager.get_n_items();

         for (let i = 0; i < numOfMonitors; i++) {
            const monitorItem = monitorManager.get_item(i);
            if (!monitorItem) continue;
            const monitor = monitorItem as Gdk.Monitor;

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
      onMonitorsChanged();

      // no need to cleanup cause listening for application
      // to quit destroys wipes everything either way
      monitorManager.connect("items-changed", () => onMonitorsChanged());
   },
});
