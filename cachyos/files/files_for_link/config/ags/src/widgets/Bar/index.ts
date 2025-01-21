import HyprlandWorkspaces from "./modules/HyprlandWorkspaces";
import Indicators from "./modules/Indicators";
import HyprlandTaskbar from "./modules/HyprlandTaskbar";
import SystemTray from "./modules/SystemTray";
import Datetime from "./modules/Time";
import Notifications from "./modules/Notifications";
import AppLauncher from "./modules/AppLauncher";
import Power from "./modules/Power";
import Battery from "./modules/Battery";
import Ram from "./modules/Ram";
import Cpu from "./modules/Cpu";
import { Astal, Gdk, Gtk, Widget } from "astal/gtk4";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   return Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-bar",
      namespace: "astal-bar",
      cssClasses: ["bar"],
      exclusivity: Astal.Exclusivity.EXCLUSIVE,
      visible: true,

      anchor:
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.LEFT |
         Astal.WindowAnchor.RIGHT,

      child: Widget.CenterBox({
         cssClasses: ["container"],

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
               children: [Notifications(), Datetime()],
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
               Power(),
            ],
         }),
      }),
   });
}
