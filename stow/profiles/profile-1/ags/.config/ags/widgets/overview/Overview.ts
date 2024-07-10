import NotificationList from "./modules/NotificationList";
import QuickSettings from "./modules/QuickSettings";
import Sliders from "./modules/Sliders";

export default (monitor: number = 0) => {
   return Widget.Window({
      monitor,
      name: `ags-overview`,
      anchor: ["top", "right", "bottom"],
      margins: [8, 8, 8, 8],
      visible: false,
      keymode: "exclusive",

      child: Widget.Box({
         className: "overview",
         vertical: true,
         children: [QuickSettings(), Sliders(), NotificationList()],

         setup: (self) =>
            self.keybind("Escape", () => App.closeWindow("ags-overview")),
      }),
   });
};
