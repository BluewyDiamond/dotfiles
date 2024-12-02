import { Widget } from "astal/gtk3";
import options from "../../../libs/options";
import AstalHyprland from "gi://AstalHyprland";

export default function (): Widget.Box {
  const hyprland = AstalHyprland.get_default();

  return new Widget.Box({
    className: "workspaces",
    spacing: options.bar.workspaces.spacing,

    children: options.bar.workspaces.values.map((index) => {
      return new Widget.Label({
        label: `${index}`,

        setup: (self) => {
          self.hook(hyprland, "notify::focused-workspace", () => {
            const workspace = hyprland.get_focused_workspace();

            if (!workspace) {
              return;
            }

            self.toggleClassName("active", index === workspace.get_id());
          });
        },
      });
    }),
  });
}
