import { Widget } from "astal/gtk3";
import options from "../../libs/options";
import AstalHyprland from "gi://AstalHyprland";

export default function (): Widget.Box {
   const hyprland = AstalHyprland.get_default();

   return new Widget.Box({
      className: "workspaces",

      children: options.bar.workspaces.values.map((index) => {
         return new Widget.Label({
            label: `${index}`,

            setup: (self) => {
               // init
               onWorkspaceFocusedChange();

               self.hook(hyprland, "notify::focused-workspace", () => {
                  onWorkspaceFocusedChange();
               });

               function onWorkspaceFocusedChange() {
                  const workspace = hyprland.get_focused_workspace();

                  if (!workspace) {
                     return;
                  }

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
      }),
   });
}
