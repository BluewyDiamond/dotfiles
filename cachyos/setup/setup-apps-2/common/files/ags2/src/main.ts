import app from "ags/gtk4/app";
// @ts-expect-error stop_complaining
import style from "./scss/main.scss";
import BarWindow from "./ui/windows/bar/BarWindow.tsx";
import NotificationToastsWindow from "./ui/windows/notificationToasts/NotificationToastsWindow.tsx";
import ControlCenterWindow from "./ui/windows/controlCenter/ControlCenterWindow.tsx";

app.start({
   css: style,

   main() {
      app.get_monitors().map(BarWindow);
      app.get_monitors().map(NotificationToastsWindow);
      app.get_monitors().map(ControlCenterWindow);
   },
});
