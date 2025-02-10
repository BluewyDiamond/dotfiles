import { App, type Astal, Gdk } from "astal/gtk4";
import Bar from "./widgets/Bar";
import { getCss } from "./utils/style";
import AppLauncher from "./widgets/AppLauncher";
import NotificationsOverview from "./widgets/NotificationsOverview";
import NotificationsPopup from "./widgets/NotificationsPopup";
import PowerMenu from "./widgets/PowerMenu";
import options from "./options";
import ControlCenter from "./widgets/ControlCenter";

App.start({
   css: getCss(),
   instanceName: "main",
   iconTheme: options.theme.icons,

   main() {
      const gdkDisplay = Gdk.Display.get_default();

      if (gdkDisplay === null) {
         print("gdkDisplay is null...");
         return;
      }

      const monitorManager = gdkDisplay.get_monitors();

      let bar: Astal.Window | null = null;
      let notificationsOverview: Astal.Window | null = null;
      let notificationsPopup: Astal.Window | null = null;
      let appLauncher: Astal.Window | null = null;
      let powerMenu: Astal.Window | null = null;
      let controlCenterWindow: Astal.Window | null = null;

      const onMonitorsChanged = (): void => {
         if (bar !== null) {
            bar.destroy();
            bar = null;
         }

         // no need to call destroy cause
         // of remove window method call
         if (notificationsOverview !== null) {
            App.remove_window(notificationsOverview);
            notificationsOverview = null;
         }

         if (notificationsPopup !== null) {
            App.remove_window(notificationsPopup);
            notificationsPopup = null;
         }

         if (appLauncher !== null) {
            App.remove_window(appLauncher);
            appLauncher = null;
         }

         if (powerMenu !== null) {
            App.remove_window(powerMenu);
            powerMenu = null;
         }

         if (controlCenterWindow !== null) {
            App.remove_window(controlCenterWindow);
            controlCenterWindow = null;
         }

         const numOfMonitors = monitorManager.get_n_items();

         for (let i = 0; i < numOfMonitors; i++) {
            const monitor = monitorManager.get_item(i);
            if (monitor === null) continue;
            if (!(monitor instanceof Gdk.Monitor)) continue;

            bar = Bar(monitor);
            notificationsOverview = NotificationsOverview(monitor);
            notificationsPopup = NotificationsPopup(monitor);
            appLauncher = AppLauncher(monitor);
            powerMenu = PowerMenu(monitor);
            controlCenterWindow = ControlCenter(monitor);

            App.add_window(notificationsOverview);
            App.add_window(notificationsPopup);
            App.add_window(appLauncher);
            App.add_window(powerMenu);
            App.add_window(controlCenterWindow);
         }
      };

      onMonitorsChanged();

      // no need to cleanup cause listening for application
      // to quit destroys wipes everything either way
      monitorManager.connect("items-changed", () => {
         onMonitorsChanged();
      });
   },
});
