import AstalHyprland from "gi://AstalHyprland";
import options from "../../../../options";
import { Accessor, createBinding, createComputed, For } from "ags";

const hyprland = AstalHyprland.get_default();

export default function () {
   const computedWorkspaces = createComputed([], () => {
      return options.hyprland.workspaces.map((workspaceNumber) =>
         hyprland.get_workspace(workspaceNumber)
      );
   });

   return (
      <button cssClasses={["button", "WorkspacesButton"]}>
         <box>
            <For each={computedWorkspaces}>
               {(i) => <WorkspaceLabel workspace={i} />}
            </For>
         </box>
      </button>
   );
}

function WorkspaceLabel({ workspace }: { workspace: AstalHyprland.Workspace }) {
   const focusedWorkspaceBinding = createBinding(hyprland, "focusedWorkspace");
   const workspaceClientsBinding = createBinding(workspace, "clients");

   const computedCssClasses = createComputed(
      [workspaceClientsBinding, focusedWorkspaceBinding],

      (clients, focusedWorkspace) => {
         const cssClasses = ["label", "WorkspaceLabel"];

         if (clients.length > 0) {
            cssClasses.push("occupied");
         }

         if (focusedWorkspace.id === workspace.id) {
            cssClasses.push("focused");
         }

         return cssClasses;
      }
   );

   return <label cssClasses={computedCssClasses} label={`${workspace.id}`} />;
}
