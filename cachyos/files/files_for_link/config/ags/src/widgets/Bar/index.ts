import { Gdk, Widget, Astal, Gtk } from "astal/gtk3";
import HyprlandWorkspaces from "./widgets/HyprlandWorkspaces";
import Indicators from "./widgets/Indicators";
import HyprlandTaskbar from "./widgets/HyprlandTaskbar";
import SystemTray from "./widgets/SystemTray";
import Datetime from "./widgets/Datetime";
import Notifications from "./widgets/Notifications";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-bar",
      namespace: "astal-bar",
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
                  children: [HyprlandWorkspaces(), HyprlandTaskbar()],
               }),
            ],
         }),

         centerWidget: new Widget.Box({
            halign: Gtk.Align.CENTER,
            children: [Notifications(), Datetime()],
         }),

         endWidget: new Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,
            children: [SystemTray(), Indicators()],
         }),
      }),
   });
}
