import { App, type Astal, Gdk } from "astal/gtk4";
import Bar from "./windows/bar/barWindow";
import { getCss } from "./utils/style";
import AppLauncher from "./windows/appLauncher/appLauncherWindow";
import NotificationsOverview from "./windows/notificationsOverview/notificationsOverviewWindow";
import NotificationsPopup from "./windows/notificationsPopup/notificationsPopupWindow";
import PowerMenu from "./windows/powerMenu/powerMenuWindow";
import options from "./options";
import ControlCenter from "./windows/controlCenter/controlCenterWindow";

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

      const monitors = gdkDisplay.get_monitors();

      let barWindow: Astal.Window | null = null;
      let notificationsOverviewWindow: Astal.Window | null = null;
      let notificationsPopupWindow: Astal.Window | null = null;
      let appLauncherWindow: Astal.Window | null = null;
      let powerMenuWindow: Astal.Window | null = null;
      let controlCenterWindow: Astal.Window | null = null;

      const onMonitorsChanged = (): void => {
         if (barWindow !== null) {
            barWindow.destroy();
            barWindow = null;
         }

         // no need to call destroy cause
         // of remove window method call
         if (notificationsOverviewWindow !== null) {
            App.remove_window(notificationsOverviewWindow);
            notificationsOverviewWindow = null;
         }

         if (notificationsPopupWindow !== null) {
            App.remove_window(notificationsPopupWindow);
            notificationsPopupWindow = null;
         }

         if (appLauncherWindow !== null) {
            App.remove_window(appLauncherWindow);
            appLauncherWindow = null;
         }

         if (powerMenuWindow !== null) {
            App.remove_window(powerMenuWindow);
            powerMenuWindow = null;
         }

         if (controlCenterWindow !== null) {
            App.remove_window(controlCenterWindow);
            controlCenterWindow = null;
         }

         const monitorsCount = monitors.get_n_items();

         for (let i = 0; i < monitorsCount; i++) {
            const monitor = monitors.get_item(i);
            if (monitor === null) continue;
            if (!(monitor instanceof Gdk.Monitor)) continue;

            barWindow = Bar(monitor);
            notificationsOverviewWindow = NotificationsOverview(monitor);
            notificationsPopupWindow = NotificationsPopup(monitor);
            appLauncherWindow = AppLauncher(monitor);
            powerMenuWindow = PowerMenu(monitor);
            controlCenterWindow = ControlCenter(monitor);

            App.add_window(notificationsOverviewWindow);
            App.add_window(notificationsPopupWindow);
            App.add_window(appLauncherWindow);
            App.add_window(powerMenuWindow);
            App.add_window(controlCenterWindow);
         }
      };

      onMonitorsChanged();

      // no need to cleanup cause listening for application
      // to quit destroys wipes everything either way
      monitors.connect("items-changed", () => {
         onMonitorsChanged();
      });
   },
});
