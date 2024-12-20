import { Gdk, Widget, Astal, Gtk } from "astal/gtk3";
import WorkspacesHyprland from "./HyprlandWorkspaces";
import Indicators from "./indicators";
import TaskbarHyprland from "./HyprlandTaskbar";
import options from "../../libs/options";
import Tray from "./Tray";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      className: "bar",
      exclusivity: Astal.Exclusivity.EXCLUSIVE,

      anchor:
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.LEFT |
         Astal.WindowAnchor.RIGHT,

      child: new Widget.CenterBox({
         startWidget: new Widget.Box({
            hexpand: true,
            halign: Gtk.Align.START,

            children: [
               new Widget.Box({
                  spacing: options.bar.indicators.spacing,
                  children: [WorkspacesHyprland(), TaskbarHyprland()],
               }),
            ],
         }),

         centerWidget: new Widget.Box({
            children: [],
         }),

         endWidget: new Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,
            spacing: options.bar.indicators.spacing,

            children: [Tray(), Indicators()],
         }),
      }),
   });
}
