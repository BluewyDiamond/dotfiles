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

   return Widget.Box({
      className: "bar-module-tray-item",
      child: button,
   });
};

function showTextWhenEmpty(sysTrayItemList: Box[]): Box[] {
   if (sysTrayItemList.length !== 0) {
      return sysTrayItemList;
   } else {
      const text = Widget.Label({
         label: "tray",
      });

      const box = Widget.Box({
         children: [text],
      });

      return [box];
   }
}

export default () => {
   return Widget.Box({
      className: "tray-bar-module",
      children: showTextWhenEmpty(
         systemtray.items.map((item) => SysTrayItem(item))
      ),

      setup: (self) =>
         self
            .hook(
               systemtray,
               (w, _) => {
                  w.children = showTextWhenEmpty(
                     systemtray.items.map((item) => SysTrayItem(item))
                  );
               },
               "added"
            )
            .hook(
               systemtray,
               (w, _) => {
                  w.children = showTextWhenEmpty(
                     systemtray.items.map((item) => SysTrayItem(item))
                  );
               },
               "removed"
            ),
   });
};
