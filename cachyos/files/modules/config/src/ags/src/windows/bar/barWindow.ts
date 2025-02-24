import HyprlandWorkspaces from "./composables/workspacesBox";
import Indicators from "./composables/indicators/indicatorsButton";
import HyprlandTaskbar from "./composables/taskbar/taskbarBox";
import SystemTray from "./composables/tray/trayBox";
import Datetime from "./composables/timeLabel";
import NotificationsIndicator from "./composables/notificationsButton";
import AppLauncher from "./composables/appLauncherButton";
import Power from "./composables/powerButton";
import Battery from "./composables/batteryBox";
import Ram from "./composables/ramButton";
import Cpu from "./composables/cpuButton";
import { Astal, type Gdk, Gtk, Widget } from "astal/gtk4";
import options from "../../options";
import ControlCenter from "./composables/controlCenterButton";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   return Widget.Window({
      gdkmonitor,
      name: options.bar.name,
      namespace: options.bar.name,
      cssClasses: ["bar"],
      exclusivity: Astal.Exclusivity.EXCLUSIVE,
      visible: true,

      anchor:
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.LEFT |
         Astal.WindowAnchor.RIGHT,

      child: Widget.CenterBox({
         cssClasses: ["main-center-box"],

         startWidget: Widget.Box({
            hexpand: true,
            halign: Gtk.Align.START,

            children: [
               Widget.Box({
                  children: [
                     AppLauncher(),
                     HyprlandWorkspaces(),
                     HyprlandTaskbar(),
                  ],
               }),
            ],
         }),

         centerWidget: Widget.CenterBox({
            halign: Gtk.Align.CENTER,

            centerWidget: Widget.Box({
               children: [NotificationsIndicator(), Datetime()],
            }),
         }),

         endWidget: Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,

            children: [
               SystemTray(),
               Indicators(),
               Ram(),
               Cpu(),
               Battery(),
               ControlCenter(),
            ],
         }),
      }),
   });
}
