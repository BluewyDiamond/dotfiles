import { App, type Astal, Gdk } from "astal/gtk4";
import { getCss } from "./utils/style";
import options from "./options";
import BarWindow from "./ui/windows/bar/BarWindow";
import NotificationsPopupWindow from "./ui/windows/notificationsPopup/NotificationsPopupWindow";
import AppLauncherWindow from "./ui/windows/appLauncher/AppLauncherWindow";
import PowerMenuWindow from "./ui/windows/powerMenu/PowerMenuWindow";
import ControlCenterWindow from "./ui/windows/controlCenter/ControlCenterWindow";

App.start({
   css: getCss(),
   instanceName: "main",
   iconTheme: options.general.icons,

   main() {
      const gdkDisplay = Gdk.Display.get_default();

      if (gdkDisplay === null) {
         print("gdkDisplay is null...");
         return;
      }

      const monitors = gdkDisplay.get_monitors();

      let barWindow: Astal.Window | null = null;
      let notificationsPopupWindow: Astal.Window | null = null;
      let appLauncherWindow: Astal.Window | null = null;
      let powerMenuWindow: Astal.Window | null = null;
      let controlCenterWindow: Astal.Window | null = null;

      const onMonitorsChanged = (): void => {
         if (barWindow !== null) {
            barWindow.destroy();
            barWindow = null;
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

            barWindow = BarWindow(monitor);
            notificationsPopupWindow = NotificationsPopupWindow(monitor);
            appLauncherWindow = AppLauncherWindow(monitor);
            powerMenuWindow = PowerMenuWindow(monitor);
            controlCenterWindow = ControlCenterWindow(monitor);

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
