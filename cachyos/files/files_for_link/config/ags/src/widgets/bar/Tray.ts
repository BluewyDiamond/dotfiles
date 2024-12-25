import { Widget } from "astal/gtk3";
import Tray from "gi://AstalTray";

export default function (): Widget.Box {
   const tray = Tray.get_default();

   const ItemForShow = (item: Tray.TrayItem): Widget.MenuButton => {
      return new Widget.MenuButton({
         setup: (self) => {
            onItemChanged();

            self.hook(item, "notify::changed", () => {
               onItemChanged();
            });

            function onItemChanged() {
               self.child = new Widget.Icon({ gIcon: item.gicon });
               self.tooltipMarkup = item.tooltipMarkup;
               self.usePopover = false;
               // @ts-ignore
               self.actionGroup = ["dbusmenu", item.actionGroup];
               self.menuModel = item.menuModel;
            }
         },
      });
   };

   return new Widget.Box({
      className: "tray",

      setup: (self) => {
         onItemsChanged();

         self.hook(tray, "notify::items", () => onItemsChanged());

         function onItemsChanged() {
            const itemsForShow = tray
               .get_items()
               .map((item) => ItemForShow(item));

            if (itemsForShow.length === 0) {
               self.visible = false;
               self.children = [];
            } else {
               self.children = [...itemsForShow];
               self.visible = true;
            }
         }
      },
   });
}
