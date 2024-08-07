import CalendarX from "./modules/CalendarX";
import Clock from "./modules/Clock";
import HyprlandTaskbar from "./modules/HyprlandTaskbar";
import HyprlandWorkspaces from "./modules/HyprlandWorkspaces";
import Indicators from "./modules/Indicators";
import NotificationIndicator from "./modules/Overview";
import Tray from "./modules/Tray";
import Volume from "./modules/Volume";

export default (monitor: number) =>
   Widget.Window({
      monitor,
      name: `ags-bar-${monitor}`,
      anchor: ["top", "left", "right"],
      exclusivity: "exclusive",
      margins: [8, 8, 0, 8],

      child: Widget.CenterBox({
         className: "bar",

         startWidget: Widget.Box({
            hpack: "start",
            children: [HyprlandWorkspaces(), HyprlandTaskbar(), Tray()],
         }),

         centerWidget: Widget.Box({
            hpack: "center",
            children: [CalendarX(), Clock()],
         }),

         endWidget: Widget.Box({
            hpack: "end",
            children: [Indicators(), NotificationIndicator()],
         }),
      }),
   });
