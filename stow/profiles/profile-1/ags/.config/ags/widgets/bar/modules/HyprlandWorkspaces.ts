const hyprland = await Service.import("hyprland");

const dispatch = (ws: string | number) =>
   hyprland.messageAsync(`dispatch workspace ${ws}`);

export default () =>
   Widget.EventBox({
      onScrollUp: () => dispatch("+1"),
      onScrollDown: () => dispatch("-1"),

      child: Widget.Box({
         className: "workspaces",

         children: ["", "󱎓", "󰋎", "", "", "", "", "󰨞"].map(
            (value, index) => {
               // because i start counting from the edges of the number row,
               // so the final accessible workspace would be 10 and not 8.
               if (index > 4) {
                  index = index + 2;
               }

               let workspace_id = index + 1;

               return Widget.Button({
                  attribute: workspace_id,
                  label: `${value}`,
                  onClicked: () => dispatch(workspace_id),

                  setup: (self) =>
                     self.hook(hyprland, () => {
                        self.toggleClassName(
                           "active",
                           hyprland.active.workspace.id === workspace_id
                        );

                        self.toggleClassName(
                           "occupied",
                           (hyprland.getWorkspace(workspace_id)?.windows || 0) >
                              0
                        );
                     }),
               });
            }
         ),
      }),
   });
