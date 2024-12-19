import { Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import CustomIcon from "../wrappers/CustomIcon";
import { curateIcon } from "../../utils";
import options from "../../libs/options";

export default function (): Widget.Box {
   const hyprland = AstalHyprland.get_default();

   return new Widget.Box({
      className: "hyprland-taskbar",
      spacing: options.bar.indicators.spacing,

      setup: (self) => {
         // init
         onClientsChange();

         self.hook(hyprland, "notify::clients", () => onClientsChange());

         function onClientsChange() {
            const clients = sortClients(hyprland.get_clients());

            const children = clients.map((client) => {
               let iconCurated = curateIcon(client.class);

               if (iconCurated === "") {
                  iconCurated = curateIcon(client.class + "-symbolic");
               }

               return CustomIcon({ icon2: iconCurated });
            });

            self.children = [...children];
         }
      },
   });

   function sortClients(
      clients: AstalHyprland.Client[]
   ): AstalHyprland.Client[] {
      const sortedClients = clients.sort((i, j) => {
         return i.workspace.get_id() - j.workspace.get_id();
      });

      return sortedClients;
   }
}
