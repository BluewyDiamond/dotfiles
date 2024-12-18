import { Widget, Gdk } from "astal/gtk3";
import Tray from "gi://AstalTray";
import CustomIcon from "../wrappers/CustomIcon";
import { curateIcon } from "../../utils";
import { bind } from "astal";

export default function (): Widget.Box {
   const tray = Tray.get_default();

   const ItemForShow = (item: Tray.TrayItem): Widget.Button => {
      return new Widget.Button({
         child: CustomIcon({
            icon2: curateIcon(item.get_icon_name()),
         }),

         onClick: (self) => {
            const menu = item.create_menu();

            if (menu == null) {
               // maybe light it up red?
               return;
            }

            // also have to light it up when active
            menu.popup_at_widget(
               self,
               Gdk.Gravity.SOUTH,
               Gdk.Gravity.NORTH,
               null
            );
         },
      });
   };

   return new Widget.Box({
      setup: (self) => {
         // init
         onItemsChange();

         self.hook(tray, "notify::items", () => onItemsChange());

         function onItemsChange() {
            const items = tray.get_items();
            const x = items.map((item) => ItemForShow(item));

            self.children = [...x];
         }
      },
   });
}
