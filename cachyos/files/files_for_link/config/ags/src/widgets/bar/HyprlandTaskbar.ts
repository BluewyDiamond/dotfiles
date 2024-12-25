import { Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { curateIcon } from "../../utils";

// TODO: Assign custom property in Widget.Icon... for sorting, removing clients.

export default function (): Widget.Box {
   const hyprland = AstalHyprland.get_default();

   return new Widget.Box({
      className: "hyprland-taskbar",

      setup: (self) => {
         onClientsChange();

         self.hook(
            hyprland,
            "client-added",
            (_, client: AstalHyprland.Client) => {
               onClientsChange();
            }
         );

         self.hook(
            hyprland,
            "client-removed",
            (_, client: AstalHyprland.Client) => {
               onClientsChange();
            }
         );

         self.hook(hyprland, "client-moved", () => {
            onClientsChange();
         });

         function onClientsChange() {
            const clients = sortClients(hyprland.get_clients());

            const children: (Widget.Icon | Widget.Label)[] = clients.map(
               (client) => {
                  let curatedIcon = curateIcon(client.class);

                  if (curatedIcon === "") {
                     return new Widget.Label({
                        label: "?",
                     });
                  } else {
                     return new Widget.Icon({
                        icon: curatedIcon,
                     });
                  }
               }
            );

            self.children = children;
         }
      },
   });
}

function sortClients(clients: AstalHyprland.Client[]): AstalHyprland.Client[] {
   const sortedClients = clients.sort((i, j) => {
      return i.workspace.get_id() - j.workspace.get_id();
   });

   return sortedClients;
}
