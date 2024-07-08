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

   if (!client || client.class === "") return DummyItem(address);

   const app = apps.list.find((app) => app.match(client.class));

   const iconUrl = findIcon(
      app?.icon_name || client.class + "-symbolic",
      "application-x-executable" + "-symbolic"
   );

   var iconOrLabel;

   if (iconUrl.length !== 0) {
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
      attribute: address,
      child: iconOrLabel,

      onClicked: () => focusClient(client.pid),

      setup: (w) =>
         w.hook(hyprland, () => {
            w.toggleClassName(
               "active",
               hyprland.active.client.address === address
            );
         }),
   });

   return Widget.Box(
      {
         attribute: { address },
         visible: Utils.watch(true, [hyprland], () => {
            return exclusive
               ? hyprland.active.workspace.id === client.workspace.id
               : true;
         }),
      },

      Widget.Overlay({
         child: button,
         pass_through: true,
         overlay: Widget.Box({
            className: "indicator",
            hpack: "center",
            vpack: "start",

            setup: (w) =>
               w.hook(hyprland, () => {
                  w.toggleClassName(
                     "active",
                     hyprland.active.client.address === address
                  );
               }),
         }),
      })
   );
};

function sortItemsOrShowTextWhenEmpty<
   T extends { attribute: { address: string } },
>(arr: T[]) {
   if (arr.length === 0) {
      const placeholder = Widget.Label({
         label: "taskbar",
      });

      const box = Widget.Box({
         children: [placeholder],
      });

      return [box];
   }

   return arr.sort(({ attribute: a }, { attribute: b }) => {
      const aclient = hyprland.getClient(a.address)!;
      const bclient = hyprland.getClient(b.address)!;
      return aclient.workspace.id - bclient.workspace.id;
   });
}

export default () => {
   return Widget.Box({
      className: "taskbar",
      children: sortItemsOrShowTextWhenEmpty(
         hyprland.clients.map((c) => AppItem(c.address))
      ),

      setup: (self) =>
         self
            .hook(
               hyprland,
               (w, address?: string) => {
                  if (typeof address === "string")
                     w.children = w.children.filter(
                        (ch) => ch.attribute.address !== address
                     );
               },
               "client-removed"
            )
            .hook(
               hyprland,
               (w, address?: string) => {
                  if (typeof address === "string")
                     w.children = sortItemsOrShowTextWhenEmpty([
                        ...w.children,
                        AppItem(address),
                     ]);
               },
               "client-added"
            )
            .hook(
               hyprland,
               (w, event?: string) => {
                  if (event === "movewindow")
                     w.children = sortItemsOrShowTextWhenEmpty(w.children);
               },
               "event"
            ),
   });
};
