import AstalHyprland from "gi://AstalHyprland";
import options from "../../../../options";
import { Accessor, createBinding, createState, For, With } from "ags";
import { Gtk } from "ags/gtk4";

const hyprland = AstalHyprland.get_default();

export default function () {
   function onFocusedWorkspaceChanged(
      label: Gtk.Label,
      workspaceNumber: number
   ): void {
      const workspace = hyprland.get_workspace(
         workspaceNumber
      ) as AstalHyprland.Workspace | null;

      if (workspace === null) {
         label.cssClasses = label.cssClasses.filter(
            (cssClass) => cssClass !== "active" && cssClass !== "occupied"
         );

         return;
      }

      const workspaceClients = workspace.get_clients();

      if (workspaceClients.length > 0) {
         label.cssClasses = [...label.cssClasses, "occupied"];
      } else {
         label.cssClasses = label.cssClasses.filter(
            (cssClass) => cssClass !== "occupied"
         );
      }

      const focusedWorkspace =
         hyprland.get_focused_workspace() as AstalHyprland.Workspace | null;

      if (focusedWorkspace === null) {
         return;
      }

      if (focusedWorkspace.id === workspaceNumber) {
         label.cssClasses = label.cssClasses.filter(
            (cssClass) => cssClass !== "urgent"
         );

         label.cssClasses = [...label.cssClasses, "active"];
      } else {
         label.cssClasses = label.cssClasses.filter(
            (cssClass) => cssClass !== "active"
         );
      }
   }

   const focusedWorkspaceAccessor = createBinding(hyprland, "focusedWorkspace");

   const [theWorkspaces, _] = createState(
      Array.from(options.hyprland.workspaces)
   );

   return (
      <button cssClasses={["box", "Workspaces"]}>
         <With value={focusedWorkspaceAccessor}>
            {(_) => (
               <box>
                  <For each={theWorkspaces}>
                     {(workspaceNumber) => (
                        <label
                           $={(self) =>
                              onFocusedWorkspaceChanged(self, workspaceNumber)
                           }
                           label={`${workspaceNumber}`}
                        />
                     )}
                  </For>
               </box>
            )}
         </With>
      </button>
   );
}
