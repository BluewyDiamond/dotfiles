import { Gdk, Widget, Astal, Gtk } from "astal/gtk3";
import HyprlandWorkspaces from "./modules/HyprlandWorkspaces";
import Indicators from "./modules/Indicators";
import HyprlandTaskbar from "./modules/HyprlandTaskbar";
import SystemTray from "./modules/SystemTray";
import Datetime from "./modules/Time";
import Notifications from "./modules/Notifications";
import AppLauncher from "./modules/AppLauncher";
import Power from "./modules/Power";

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
                  children: [
                     AppLauncher(),
                     HyprlandWorkspaces(),
                     HyprlandTaskbar(),
                  ],
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
            children: [SystemTray(), Indicators(), Power()],
         }),
      }),
   });
}
