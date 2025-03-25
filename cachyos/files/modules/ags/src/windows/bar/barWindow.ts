import workspacesBox from "./composables/workspacesBox";
import indicatorsButton from "./composables/indicators/indicatorsButton";
import taskbarBox from "./composables/taskbar/taskbarBox";
import trayBox from "./composables/tray/trayBox";
import timeLabel from "./composables/timeLabel";
import notificationsButton from "./composables/notificationsButton";
import appLauncherButton from "./composables/appLauncherButton";
import batteryBox from "./composables/batteryBox";
import ramButton from "./composables/ramButton";
import cpuButton from "./composables/cpuButton";
import { Astal, type Gdk, Gtk, Widget } from "astal/gtk4";
import options from "../../options";
import powerButton from "./composables/powerButton";

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
                     appLauncherButton(),
                     workspacesBox(),
                     taskbarBox(),
                  ],
               }),
            ],
         }),

         centerWidget: Widget.CenterBox({
            halign: Gtk.Align.CENTER,

            centerWidget: Widget.Box({
               children: [notificationsButton(), timeLabel()],
            }),
         }),

         endWidget: Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,

            children: [
               trayBox(),
               indicatorsButton(),
               ramButton(),
               cpuButton(),
               batteryBox(),
               powerButton(),
            ],
         }),
      }),
   });
}
