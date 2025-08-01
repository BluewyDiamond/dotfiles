import app from "ags/gtk4/app";
// @ts-expect-error stop_complaining
import style from "./scss/main.scss";
import BarWindow from "./ui/windows/bar/BarWindow.tsx";
import NotificationToastsWindow from "./ui/windows/notificationToasts/NotificationToastsWindow.tsx";
import ControlCenterWindow from "./ui/windows/controlCenter/ControlCenterWindow.tsx";
import AstalHyprland from "gi://AstalHyprland";
import { createBinding, createComputed, createState, For } from "ags";
import { interval, timeout } from "ags/time.ts";
import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk?version=4.0";

app.start({
   css: style,

   main() {
      const monitorsBinding = createBinding(app, "monitors");
      const [monitorsState, setMonitorsState] = createState<Gdk.Monitor[]>([]);

      monitorsBinding.subscribe(() => {
         timeout(3000, () => {
            setMonitorsState(app.get_monitors());
         });
      });

      setMonitorsState(app.get_monitors());

      <For
         each={monitorsBinding}
         cleanup={(win) => (win as Gtk.Window).destroy()}
      >
         {(monitor) => <BarWindow gdkmonitor={monitor} />}
      </For>;
   },
});
