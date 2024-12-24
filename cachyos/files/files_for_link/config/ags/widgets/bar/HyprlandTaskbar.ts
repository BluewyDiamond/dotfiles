import { Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import CustomIcon from "../wrappers/CustomIcon";
import { curateIcon } from "../../utils";
import options from "../../libs/options";
import Apps from "gi://AstalApps";

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
               const apps = new Apps.Apps();

               const foundedApp = apps.list.find((app) => {
                  const entry = app.get_entry();
                  const executable = app.get_executable();
                  const description = app.get_description();

                  if (!entry) {
                     return false;
                  }

                  if (!executable) {
                     return false;
                  }

                  if (!description) {
                     return false;
                  }

                  if(app.get_name().toLowerCase().includes(client.class.toLowerCase())) {
                     return true;
                  } else if (app.get_entry().toLowerCase().includes(client.class.toLowerCase())) {
                     return true;
                  } else if (app.get_executable().toLowerCase().includes(client.class.toLowerCase())) {
                     return true;
                  } else if (app.get_description().toLowerCase().includes(client.class.toLowerCase())) {
                     return true;
                  } else {
                     return false;
                  }
               })

               let iconCurated = curateIcon(foundedApp?.get_icon_name());

               if (iconCurated === "") {
                  iconCurated = curateIcon(client.class);
               }

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
