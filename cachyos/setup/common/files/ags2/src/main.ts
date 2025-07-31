import app from "ags/gtk4/app";
// @ts-expect-error stop_complaining
import style from "./scss/main.scss";
import BarWindow from "./ui/windows/bar/BarWindow.tsx";
import NotificationToastsWindow from "./ui/windows/notificationToasts/NotificationToastsWindow.tsx";
import ControlCenterWindow from "./ui/windows/controlCenter/ControlCenterWindow.tsx";
import AstalHyprland from "gi://AstalHyprland";
import { createBinding, createComputed } from "ags";

const hyprland = AstalHyprland.get_default();

app.start({
   css: style,

   main() {
      const monitorsBinding = createBinding(hyprland, "monitors");

      const computedDesiredMonitor = createComputed(
         [monitorsBinding],
         () => app.get_monitors()[0]
      );

      BarWindow(computedDesiredMonitor);
      ControlCenterWindow(computedDesiredMonitor);
      NotificationToastsWindow(computedDesiredMonitor);
   },
});
