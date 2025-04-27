import { Astal, type Gdk, Gtk, Widget } from "astal/gtk4";
import options from "../../../options";
import AppLauncherButton from "./composables/AppLauncherButton";
import WorkspacesBox from "./composables/WorkspacesBox";
import TaskbarBox from "./composables/taskbar/TaskbarBox";
import NotificationsButton from "./composables/NotificationsButton";
import TimeLabel from "./composables/TimeLabel";
import TrayBox from "./composables/tray/TrayBox";
import IndicatorsButton from "./composables/indicators/IndicatorsButton";
import BatteryBox from "./composables/BatteryBox";
import PowerButton from "./composables/PowerButton";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   return Widget.Window({
      gdkmonitor,
      name: options.bar.name,
      namespace: options.bar.name,
      cssClasses: ["bar-window"],
      exclusivity: Astal.Exclusivity.EXCLUSIVE,
      visible: true,

      anchor:
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.LEFT |
         Astal.WindowAnchor.RIGHT,

      child: Widget.CenterBox({
         cssClasses: ["bar-center-box"],

         startWidget: Widget.Box({
            hexpand: true,
            halign: Gtk.Align.START,

            children: [
               Widget.Box({
                  children: [
                     AppLauncherButton(),
                     WorkspacesBox(),
                     TaskbarBox(),
                  ],
               }),
            ],
         }),

         centerWidget: Widget.CenterBox({
            halign: Gtk.Align.CENTER,

            centerWidget: Widget.Box({
               children: [NotificationsButton(), TimeLabel()],
            }),
         }),

         endWidget: Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,

            children: [
               TrayBox(),
               IndicatorsButton(),
               BatteryBox(),
               PowerButton(),
            ],
         }),
      }),
   });
}
