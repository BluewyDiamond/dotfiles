import HyprlandWorkspaces from "./composables/HyprlandWorkspaces";
import Indicators from "./composables/Indicators";
import HyprlandTaskbar from "./composables/HyprlandTaskbar";
import SystemTray from "./composables/SystemTray";
import Datetime from "./composables/Time";
import NotificationsIndicator from "./composables/NotificationsIndicator";
import AppLauncher from "./composables/AppLauncher";
import Power from "./composables/Power";
import Battery from "./composables/Battery";
import Ram from "./composables/Ram";
import Cpu from "./composables/Cpu";
import { Astal, type Gdk, Gtk, Widget } from "astal/gtk4";
import options from "../../options";
import ControlCenter from "./composables/ControlCenter";

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
