import { Box } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { TrayItem } from "types/service/systemtray";

const systemtray = await Service.import("systemtray");

const SysTrayItem = (item: TrayItem) => {
   const button = Widget.Button({
      attribute: { item },
      child: Widget.Icon().bind("icon", item, "icon"),
      tooltipMarkup: item.bind("tooltip_markup"),
      onPrimaryClick: (_, event) => item.activate(event),
      onSecondaryClick: (_, event) => item.openMenu(event),
   });

   return button
};

export default () => {
   const tray = Widget.Box({
      spacing: 8,
      children: systemtray.bind("items").as(items => items.map(SysTrayItem))
   });

   const empty = Widget.Label({
      label: "tray",
   });

   const stack = Widget.Stack({
      children: {
         tray: tray,
         empty: empty
      },

      shown: systemtray.bind("items").as((items) => {
         if (items.length > 0) {
            return "tray"
         } else {
            return "empty"
         }
      })
   })

   // nest it inside box otherwise border radius do wonky stuff
   const wrapper = Widget.Box({
      className: "tray-bar-module",
      child: stack
   })

   return wrapper;
};
