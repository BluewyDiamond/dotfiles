import { type Gtk, hook, Widget } from "astal/gtk4";
import Tray from "gi://AstalTray";
import { EfficientRenderingMap } from "../../../../../libs/efficientRendering";
import Trackable from "../../../../../libs/Trackable";

const tray = Tray.get_default();

function TrayItemMenuButton(item: Tray.TrayItem): Gtk.MenuButton {
   return Widget.MenuButton(
      {
         cssClasses: ["bar-item", "tray-item"],

         setup: (self) => {
            const onItemChanged = (item: Tray.TrayItem): void => {
               const { tooltipMarkup, actionGroup, menuModel } = item;

               self.tooltipMarkup = tooltipMarkup;
               self.insert_action_group("dbusmenu", actionGroup);
               self.menuModel = menuModel;
            };

            onItemChanged(item);

            hook(self, item, "notify::gicon", () => {
               onItemChanged(tray.get_item(item.get_item_id()));
            });

            hook(self, self, "notify::active", () => {
               if (self.active) {
                  self.cssClasses = [...self.cssClasses, "active"];
               } else {
                  self.cssClasses = self.cssClasses.filter(
                     (className) => className !== "active"
                  );
               }
            });
         },
      },

      Widget.Image({
         gicon: item.gicon,

         setup: (self) => {
            hook(self, item, "changed", () => {
               const changedItem = tray.get_item(item.get_item_id());
               const { gicon } = changedItem;
               self.gicon = gicon;
            });
         },
      })
   );
}

export class TrayItemsEfficientRendering extends EfficientRenderingMap<
   string,
   Gtk.Widget,
   Gtk.Widget
> {
   private readonly trackable = new Trackable();

   constructor() {
      super();
      this.init();
   }

   destroy(): void {
      super.destroy();
      this.trackable.destroy();
   }

   private init(): void {
      tray.get_items().forEach((item) => {
         this.map.set(item.get_item_id(), TrayItemMenuButton(item));
         this.notify();
      });

      this.trackable.track([
         tray.connect("item-added", (_, itemId: string) => {
            const item = tray.get_item(itemId);
            this.map.set(itemId, TrayItemMenuButton(item));
            this.notify();
         }),

         tray,
      ]);

      this.trackable.track([
         tray.connect("item-removed", (_, itemId: string) => {
            this.map.delete(itemId);
            this.notify();
         }),

         tray,
      ]);
   }

   protected notify(): void {
      this.variable.set([...this.map.values()]);
   }
}
