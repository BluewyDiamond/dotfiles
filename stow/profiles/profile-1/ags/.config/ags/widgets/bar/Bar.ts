import Clock from "./modules/Clock";
import HyprlandTaskbar from "./modules/HyprlandTaskbar";
import HyprlandWorkspaces from "./modules/HyprlandWorkspaces";
import Tray from "./modules/Tray";
import Volume from "./modules/Volume";

const time = Variable("", {
   poll: [
      1000,

      function () {
         return Date().toString();
      },
   ],
});

export default (monitor: number) =>
   Widget.Window({
      monitor,
      name: `ags-bar-${monitor}`,
      anchor: ["top", "left", "right"],
      exclusivity: "exclusive",
      margins: [8, 8, 0, 8],

      child: Widget.CenterBox({
         className: "superBar",

         startWidget: Widget.Box({
            hpack: "start",
            children: [HyprlandWorkspaces(), HyprlandTaskbar(), Tray()],
         }),

         centerWidget: Widget.Box({
            hpack: "center",
            children: [Clock()],
         }),

         endWidget: Widget.Box({
            hpack: "end",
            children: [Volume()],
         }),
      }),
   });
