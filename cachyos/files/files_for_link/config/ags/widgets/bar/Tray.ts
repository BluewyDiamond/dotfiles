import { Widget, Gdk } from "astal/gtk3";
import Tray from "gi://AstalTray";
import CustomIcon from "../wrappers/CustomIcon";
import { curateIcon } from "../../utils";
import options from "../../libs/options";

export default function (): Widget.Box {
   const tray = Tray.get_default();

   const ItemForShow = (item: Tray.TrayItem): Widget.Button => {
      const menu = item.create_menu();

      return new Widget.Button({
         child: CustomIcon({
            icon2: curateIcon(item.get_icon_name()),
         }),

         setup: (self) => {
            if (menu == null) {
               return;
            }

            const menuId = menu.connect("popped-up", () => {
               self.toggleClassName("active");

               menu.connect("notify::visible", () => {
                  self.toggleClassName("active", menu.get_visible());
               });

               menu.disconnect(menuId);
            });

            self.connect("destroy", () => menu.disconnect(menuId));
         },

         onClick: (self) => {
            if (menu == null) {
               // maybe light it up red?
               return;
            }

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
      className: "tray",
      spacing: options.bar.indicators.spacing,

      setup: (self) => {
         // init
         onItemsChange();

         self.hook(tray, "notify::items", () => onItemsChange());

         function onItemsChange() {
            const items = tray.get_items();
            const x = items.map((item) => ItemForShow(item));

            if (x.length === 0) {
               self.visible = false;
               self.children = [];
            } else {
               self.children = [...x];
               self.visible = true;
            }
         }
      },
   });
}
