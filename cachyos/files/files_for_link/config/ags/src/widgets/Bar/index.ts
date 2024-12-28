import { Gdk, Widget, Astal, Gtk } from "astal/gtk3";
import WorkspacesHyprland from "./HyprlandWorkspaces";
import Indicators from "./indicators";
import TaskbarHyprland from "./HyprlandTaskbar";
import Tray from "./Tray";
import Datetime from "./Datetime";
import Notification from "./Notifications";

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
                  children: [WorkspacesHyprland(), TaskbarHyprland()],
               }),
            ],
         }),

         centerWidget: new Widget.Box({
            halign: Gtk.Align.CENTER,
            children: [Notification(), Datetime()],
         }),

         endWidget: new Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,
            children: [Tray(), Indicators()],
         }),
      }),
   });
}
