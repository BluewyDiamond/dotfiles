import { TrayItem } from "types/service/systemtray";

const systemtray = await Service.import("systemtray");

const SysTrayItem = (item: TrayItem) => {
   const button = Widget.Button({
      child: Widget.Icon().bind("icon", item, "icon"),
      tooltipMarkup: item.bind("tooltip_markup"),
      onPrimaryClick: (_, event) => item.activate(event),
      onSecondaryClick: (_, event) => item.openMenu(event),
   });

   return Widget.Box({
      child: button,
   });
};

function process(arr) {
   if (arr.length !== 0) {
      return arr;
   } else {
      const placeholder = Widget.Label({
         label: "tray",
      });

      const box = Widget.Box({
         children: [placeholder],
      });

      return [box];
   }
}

export default () => {
   return Widget.Box({
      className: "tray",
      children: process(systemtray.items.map((item) => SysTrayItem(item))),

      setup: (self) =>
         self
            .hook(
               systemtray,
               (w, _) => {
                  const xxx = process(
                     systemtray.items.map((item) => SysTrayItem(item))
                  );

                  w.children = xxx;
               },
               "added"
            )
            .hook(
               systemtray,
               (w, _) => {
                  const xxx = process(
                     systemtray.items.map((item) => SysTrayItem(item))
                  );

                  w.children = xxx;
               },
               "removed"
            ),
   });
};
