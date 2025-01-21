import { Astal, hook, Widget } from "astal/gtk4";
import options from "../../../options";
import AstalHyprland from "gi://AstalHyprland";

const hyprland = AstalHyprland.get_default();

export default function (): Astal.Box {
   return Widget.Box({
      cssClasses: ["hyprland-workspaces"],

      children: options.bar.workspaces.values.map((index) => {
         return Widget.Button(
            {
               onClicked: async () => {
                  (async () => {
                     hyprland.dispatch("workspace", `${index}`);
                  })();
               },

               setup: (self) => {
                  function onWorkspaceFocusedChange() {
                     const workspace = hyprland.focusedWorkspace;
                     if (!workspace) return;

                     if (
                        // get_workspace can return null despite what return type idicates
                        (hyprland.get_workspace(index)?.get_clients().length ||
                           0) > 0
                     ) {
                        self.cssClasses = [...self.cssClasses, "occupied"];
                     } else {
                        self.cssClasses = self.cssClasses.filter(
                           (cssClass) => cssClass !== "occupied"
                        );
                     }

                     if (workspace.id === index) {
                        self.cssClasses = self.cssClasses.filter(
                           (cssClass) => cssClass !== "urgent"
                        );

                        self.cssClasses = [...self.cssClasses, "active"];
                     } else {
                        self.cssClasses = self.cssClasses.filter(
                           (cssClass) => cssClass !== "active"
                        );
                     }
                  }

                  onWorkspaceFocusedChange();

                  hook(self, hyprland, "notify::focused-workspace", () => {
                     onWorkspaceFocusedChange();
                  });

                  hook(
                     self,
                     hyprland,
                     "urgent",

                     (_, client: AstalHyprland.Client) => {
                        if (!client) return;

                        if (index === client.get_workspace().get_id()) {
                           self.cssClasses = [...self.cssClasses, "urgent"];
                        }
                     }
                  );
               },
            },

            Widget.Label({
               label: `${index}`,
            })
         );
      }),
   });
}
