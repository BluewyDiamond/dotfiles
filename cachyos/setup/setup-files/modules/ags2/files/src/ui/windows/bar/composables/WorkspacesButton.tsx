import AstalHyprland from "gi://AstalHyprland";
import options from "../../../../options";
import { Accessor, createBinding, createComputed, For } from "ags";

const hyprland = AstalHyprland.get_default();

export default function () {
   const workspaces = createComputed([], () => {
      return options.hyprland.workspaces.map((workspaceNumber) =>
         hyprland.get_workspace(workspaceNumber)
      );
   });

   return (
      <button cssClasses={["box", "Workspaces"]}>
         <For each={workspaces}>{(i) => <WorkspaceLabel workspace={i} />}</For>
      </button>
   );
}

function WorkspaceLabel({ workspace }: { workspace: AstalHyprland.Workspace }) {
   const focusedWorkspaceBinding = createBinding(hyprland, "focusedWorkspace");
   const workspaceClientsBinding = createBinding(workspace, "clients");

   const labelCssClasses = createComputed(
      [workspaceClientsBinding, focusedWorkspaceBinding],
      (clients, focusedWorkspace) => {
         const labelCssClasses = [];

         if (clients.length > 0) {
            labelCssClasses.push("ocuppied");
         } else {
            labelCssClasses.push("empty");
         }

         if (focusedWorkspace.id === workspace.id) {
            labelCssClasses.push("focused");
         }

         return labelCssClasses;
      }
   );

   return <label cssClasses={labelCssClasses} label={`${workspace.id}`} />;
}
