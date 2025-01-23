import HyprlandWorkspaces from "./items/HyprlandWorkspaces";
import Indicators from "./items/Indicators";
import HyprlandTaskbar from "./items/HyprlandTaskbar";
import SystemTray from "./items/SystemTray";
import Datetime from "./items/Time";
import Notifications from "./items/Notifications";
import AppLauncher from "./items/AppLauncher";
import Power from "./items/Power";
import Battery from "./items/Battery";
import Ram from "./items/Ram";
import Cpu from "./items/Cpu";
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
