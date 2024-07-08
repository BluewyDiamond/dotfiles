import NotificationList from "./modules/NotificationList";
import QuickSettings from "./modules/QuickSettings";

export default (monitor: number = 0) => {
   const test = Widget.Box({
      hexpand: true,
      vexpand: true,
      child: Widget.Label({
         label: "senoatrenioatneioarntreion",
      }),
   });

   return Widget.Window({
      monitor,
      name: `ags-overview`,
      anchor: ["top", "right", "bottom"],
      margins: [8, 8, 8, 8],
      visible: false,

      child: Widget.Box({
         className: "overview",
         vertical: true,
         children: [QuickSettings(), NotificationList()],
      }),
   });
};
