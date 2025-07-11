import AstalHyprland from "gi://AstalHyprland";
import options from "../../../../options";
import { Accessor, createBinding, createComputed } from "ags";

const hyprland = AstalHyprland.get_default();

export default function () {
   return (
      <button cssClasses={["button", "WorkspacesButton"]}>
         <box>
            {options.hyprland.workspaces.map((workspaceNumber) => (
               <WorkspaceLabel workspaceNumber={workspaceNumber} />
            ))}
         </box>
      </button>
   );
}

function WorkspaceLabel({ workspaceNumber }: { workspaceNumber: number }) {
   const focusedWorkspaceBinding = createBinding(hyprland, "focusedWorkspace");

   const computedCssClasses = createComputed(
      [focusedWorkspaceBinding],

      (focusedWorkspace) => {
         const cssClasses = ["label", "WorkspaceLabel"];

         const workspace = hyprland.get_workspace(
            workspaceNumber
         ) as AstalHyprland.Workspace | null;

         if (workspace === null) {
            return cssClasses;
         }

         const clients = workspace.get_clients();

         if (clients.length > 0) {
            cssClasses.push("occupied");
         }

         if (focusedWorkspace.id === workspace.id) {
            cssClasses.push("focused");
         }

         return cssClasses;
      }
   );

   return (
      <label cssClasses={computedCssClasses} label={`${workspaceNumber}`} />
   );
}
