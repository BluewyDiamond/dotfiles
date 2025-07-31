import app from "ags/gtk4/app";
// @ts-expect-error stop_complaining
import style from "./scss/main.scss";
import BarWindow from "./ui/windows/bar/BarWindow.tsx";
import NotificationToastsWindow from "./ui/windows/notificationToasts/NotificationToastsWindow.tsx";
import ControlCenterWindow from "./ui/windows/controlCenter/ControlCenterWindow.tsx";
import AstalHyprland from "gi://AstalHyprland";
import { Accessor, createBinding, createComputed } from "gnim";

const hyprland = AstalHyprland.get_default();

app.start({
   css: style,

   main() {
      app.get_monitors().map(BarWindow);
      app.get_monitors().map(NotificationToastsWindow);
      app.get_monitors().map(ControlCenterWindow);

      const monitorsBinding = createBinding(hyprland, "monitors");

      createComputed([monitorsBinding], () => {
         print("reacted");
      });
   },
});
