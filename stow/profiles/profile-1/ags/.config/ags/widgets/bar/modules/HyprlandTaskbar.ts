import findIcon from "libs/utils/findIcon";

const hyprland = await Service.import("hyprland");
const apps = await Service.import("applications");
const exclusive = false;

const focusClient = (process_id: number) =>
   hyprland.messageAsync(`dispatch focuswindow pid:${process_id}`);

const DummyItem = (address: string) =>
   Widget.Box({
      attribute: { address },
      visible: false,
   });

const AppItem = (address: string) => {
   const client = hyprland.getClient(address);

   if (!client || client.class === "") {
      return DummyItem(address)
   };

   const app = apps.list.find((app) => app.match(client.class));

   const iconUrl = findIcon(
      app?.icon_name || client.class + "-symbolic",
      "application-x-executable" + "-symbolic"
   );

   var iconOrLabel;

   if (iconUrl !== "") {
      iconOrLabel = Widget.Icon({
         size: 16,
         icon: iconUrl,
      });
   } else {
      iconOrLabel = Widget.Label({
         label: "x",
      });
   }

   const button = Widget.Button({
      attribute: { address },
      child: iconOrLabel,

      onClicked: () => focusClient(client.pid),

      setup: (self) =>
         self
            .hook(hyprland, (self) => {
               self.toggleClassName("active", hyprland.active.client.address === address)
            })
   });

   return button
};

function sortItems<T extends { attribute: { address: string } }>(arr: T[]) {
   return arr.sort(({ attribute: a }, { attribute: b }) => {
      const aclient = hyprland.getClient(a.address)!;
      const bclient = hyprland.getClient(b.address)!;
      return aclient.workspace.id - bclient.workspace.id;
   });
}

export default () => {
   const taskbar = Widget.Box({
      spacing: 8,
      children: sortItems(hyprland.clients.map(client => AppItem(client.address))),

      setup: (self) =>
         self
            .hook(hyprland, (self, address?: string) => {
               if (typeof address !== "string") {
                  return
               }

               self.children = sortItems([...self.children, AppItem(address)])
            }, "client-added")
            .hook(hyprland, (self, address?: string) => {
               if (typeof address !== "string") {
                  return
               }

               self.children = self.children.filter(child => child.attribute.address !== address)
            }, "client-removed")
            .hook(hyprland, (self, event: string) => {
               if (event !== "movewindow") {
                  return
               }

               self.children = sortItems(self.children)
            })
   })

   const empty = Widget.Label({
      label: "taskbar"
   })

   const stack = Widget.Stack({
      children: {
         taskbar: taskbar,
         empty: empty
      },

      shown: hyprland.bind("clients").as((clients) => {
         if (clients.length > 0) {
            return "taskbar"
         } else {
            return "empty"
         }
      })
   })

   const wrapper = Widget.Box({
      className: "taskbar-bar-module",

      child: stack
   })

   return wrapper
};
