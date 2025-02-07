import { type Astal, hook, Widget } from "astal/gtk4";
import options from "../../../options";
import AstalHyprland from "gi://AstalHyprland";

const hyprland = AstalHyprland.get_default();

export default function (): Astal.Box {
   return Widget.Box({
      cssClasses: ["workspaces"],

      children: options.bar.workspaces.values.map((index) =>
         Widget.Button(
            {
               onClicked: () => {
                  hyprland.dispatch("workspace", `${index}`);
               },

               setup: (self) => {
                  const onWorkspaceFocusedChange = (): void => {
                     const { focusedWorkspace } = hyprland;

                     const workspace = hyprland.get_workspace(
                        index
                     ) as AstalHyprland.Workspace | null;

                     if (workspace === null) return;

                     const clients: AstalHyprland.Client[] | null =
                        workspace.get_clients() as
                           | AstalHyprland.Client[]
                           | null;

                     if (clients === null) {
                        return;
                     }

                     if (clients.length > 0) {
                        self.cssClasses = [...self.cssClasses, "occupied"];
                     } else {
                        self.cssClasses = self.cssClasses.filter(
                           (cssClass) => cssClass !== "occupied"
                        );
                     }

                     if (focusedWorkspace.id === index) {
                        self.cssClasses = self.cssClasses.filter(
                           (cssClass) => cssClass !== "urgent"
                        );

                        self.cssClasses = [...self.cssClasses, "active"];
                     } else {
                        self.cssClasses = self.cssClasses.filter(
                           (cssClass) => cssClass !== "active"
                        );
                     }
                  };

                  onWorkspaceFocusedChange();

                  hook(self, hyprland, "notify::focused-workspace", () => {
                     onWorkspaceFocusedChange();
                  });

                  hook(
                     self,
                     hyprland,
                     "urgent",

                     (_, client: AstalHyprland.Client) => {
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
         )
      ),
   });
}
