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
               print("i -> " + index);
               if (index > 4) {
                  index = index + 2;
               }
               print("after i -> " + index);

               let workspace_id = index + 1;

               return Widget.Button({
                  attribute: workspace_id,
                  label: `${value}`,
                  onClicked: () => dispatch(workspace_id),

                  setup: (self) =>
                     self.hook(hyprland, () => {
                        print(
                           hyprland.active.workspace.id + " ?= " + workspace_id
                        );

                        print(hyprland.active.workspace.id === workspace_id);

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
