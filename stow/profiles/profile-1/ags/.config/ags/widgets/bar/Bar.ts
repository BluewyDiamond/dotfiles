import Workspaces from "./modules/Workspaces";

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

      child: Widget.CenterBox({
         start_widget: Widget.Label({
            hpack: "center",
            label: "Welcome to AGS!",
         }),

         center_widget: Widget.Box({
            children: [Workspaces()],
         }),

         end_widget: Widget.Label({
            hpack: "center",
            label: time.bind(),
         }),
      }),
   });
