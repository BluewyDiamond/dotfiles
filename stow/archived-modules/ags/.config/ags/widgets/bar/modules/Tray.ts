import { Box } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { TrayItem } from "types/service/systemtray";

const systemtray = await Service.import("systemtray");

const SysTrayItem = (item: TrayItem) => {
   const button = Widget.Button({
      child: Widget.Icon().bind("icon", item, "icon"),
      tooltipMarkup: item.bind("tooltip_markup"),
      onPrimaryClick: (_, event) => item.activate(event),
      onSecondaryClick: (_, event) => item.openMenu(event),
   });

   return button;
};

export default () => {
   const label = Widget.Label({
      label: "tray",
   });

   // TODO: solve the same problem as hyprland taskbar...
   const tray = Widget.Box({
      className: "tray-bar-module",
      hpack: "center",
      spacing: 8,
      children: systemtray.bind("items").as((items) => items.map(SysTrayItem)),

      setup: (self) =>
         self.hook(systemtray, (self) => {
            if (self.children.length > 0) {
               return;
            }

            self.children = [label];
         }),
   });

   return tray;
};
