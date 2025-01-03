import { Widget } from "astal/gtk3";
import options from "../../../options";
import AstalHyprland from "gi://AstalHyprland";
import { timeout } from "astal";

export default function (): Widget.Box {
   const hyprland = AstalHyprland.get_default();

   return new Widget.Box({
      className: "workspaces",

      children: options.bar.workspaces.values.map((index) => {
         const label = new Widget.Label({
            label: `${index}`,

            setup: (self) => {
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

               function onWorkspaceFocusedChange() {
                  const workspace = hyprland.get_focused_workspace();
                  if (!workspace) return;

                  self.toggleClassName("urgent", false);

                  self.toggleClassName(
                     "occupied",
                     // get_workspace can return null despite what return type idicates
                     (hyprland.get_workspace(index)?.get_clients().length ||
                        0) > 0
                  );

                  self.toggleClassName("active", index === workspace.get_id());
               }
            },
         });

         return new Widget.Button(
            {
               onClick: async () => {
                  (async () => {
                     hyprland.dispatch("workspace", `${index}`);
                  })();

                  (async () => {
                     label.toggleClassName("clicked", true);

                     timeout(1000, () => {
                        label.toggleClassName("clicked", false);
                     });
                  })();
               },
            },

            label
         );
      }),
   });
}
