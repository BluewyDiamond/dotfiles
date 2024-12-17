import { Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import CustomIcon from "../wrappers/CustomIcon";
import { curateIcon } from "../../utils";

export default function (): Widget.Box {
   const hyprland = AstalHyprland.get_default();

   return new Widget.Box({
      setup: (self) => {
         // init
         onClientsChange();

         self.hook(hyprland, "notify::clients", () => {
            onClientsChange();
         });

         function onClientsChange() {
            const clients = hyprland.get_clients();

            const i = clients.map((client) => {
               let iconCurated = curateIcon(client.class);

               if (iconCurated === "") {
                  iconCurated = curateIcon(client.class + "-symbolic");
               }

               return CustomIcon({ icon2: iconCurated });
            });

            self.children = [...i];
         }
      },
   });
}
