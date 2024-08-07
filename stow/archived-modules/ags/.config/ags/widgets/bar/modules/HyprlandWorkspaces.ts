const hyprland = await Service.import("hyprland");

const focusWorkspace = (ws: string | number) =>
   hyprland.messageAsync(`dispatch workspace ${ws}`);

export default () =>
   Widget.EventBox({
      onScrollUp: () => focusWorkspace("+1"),
      onScrollDown: () => focusWorkspace("-1"),

      child: Widget.Box({
         className: "workspaces-bar-module",

         children: ["", "󱎓", "󰋎", "", "", "", "󰨞"].map((value, index) => {
            // because i start counting from the edges of the number row,
            // so the final accessible workspace would be 10 and not 8.
            if (index > 3) {
               index = index + 3;
            }

            let workspace_id = index + 1;

            return Widget.Button({
               attribute: workspace_id,
               label: `${value}`,
               onClicked: () => focusWorkspace(workspace_id),

               setup: (self) =>
                  self
                     .hook(hyprland, () => {
                        self.toggleClassName(
                           "active",
                           hyprland.active.workspace.id === workspace_id
                        );

                        self.toggleClassName(
                           "occupied",
                           (hyprland.getWorkspace(workspace_id)?.windows || 0) >
                              0
                        );
                     })
                     .hook(
                        hyprland,
                        (self, address: string) => {
                           const client = hyprland.getClient(address);

                           self.toggleClassName(
                              "urgent",
                              client?.workspace.id === workspace_id
                           );
                        },
                        "urgent-window"
                     )
                     .hook(hyprland.active.workspace, (self) => {
                        if (hyprland.active.workspace.id !== workspace_id) {
                           return;
                        }

                        self.toggleClassName("urgent", false);
                     }),
            });
         }),
      }),
   });
