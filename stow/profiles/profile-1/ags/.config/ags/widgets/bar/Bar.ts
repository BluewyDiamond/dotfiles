import HyprlandWorkspaces from "./modules/HyprlandWorkspaces";

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

         start_widget: Widget.Box({
            children: [HyprlandWorkspaces()],
         }),
      }),
   });
