import { Widget } from "astal/gtk3";
import options from "../../../options";
import AstalHyprland from "gi://AstalHyprland";
import { timeout } from "astal";

const hyprland = AstalHyprland.get_default();

export default function (): Widget.Box {
   return new Widget.Box({
      className: "hyprland-workspaces",

      children: options.bar.workspaces.values.map((index) => {
         return new Widget.Button(
            {
               onClick: async () => {
                  (async () => {
                     hyprland.dispatch("workspace", `${index}`);
                  })();
               },

               setup: (self) => {
                  function onWorkspaceFocusedChange() {
                     const workspace = hyprland.focusedWorkspace;
                     if (!workspace) return;

                     self.toggleClassName("urgent", false);

                     self.toggleClassName(
                        "occupied",
                        // get_workspace can return null despite what return type idicates
                        (hyprland.get_workspace(index)?.get_clients().length ||
                           0) > 0
                     );

                     self.toggleClassName("active", index === workspace.id);
                  }

                  onWorkspaceFocusedChange();

                  self.hook(hyprland, "notify::focused-workspace", () => {
                     onWorkspaceFocusedChange();
                  });

                  self.hook(
                     hyprland,
                     "urgent",

                     (_, client: AstalHyprland.Client) => {
                        self.toggleClassName(
                           "urgent",
                           index === client.get_workspace().get_id()
                        );
                     }
                  );
               },
            },

            new Widget.Label({
               label: `${index}`,
            })
         );
      }),
   });
}
