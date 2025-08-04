import options from "../../../../options";
import { Accessor, createBinding, createComputed, createConnection } from "ags";
import AstalNiri from "gi://AstalNiri";

const niri = AstalNiri.get_default();

export default function () {
   return (
      <button cssClasses={["workspaces-button"]}>
         <box>
            {options.bar.niriWorkspaces.names.map((workspaceName) => (
               <WorkspaceLabel workspaceName={workspaceName} />
            ))}
         </box>
      </button>
   );
}

// TODO: pass real workspace
function WorkspaceLabel({ workspaceName }: { workspaceName: string }) {
   const focusedWorkspaceBinding = createBinding(niri, "focusedWorkspace");

   const workspace = niri
      .get_workspaces()
      .find((workspace) => workspace.name === workspaceName);

   if (workspace === undefined) return;

   const urgentWorkspaceBinding = createConnection(0, [
      workspace,
      "notify::is-urgent",
      () => 0,
   ]);

   const computedCssClasses = createComputed(
      [focusedWorkspaceBinding, urgentWorkspaceBinding],

      (_, __) => {
         const cssClasses = ["workspace-label"];

         if (workspace.get_windows().length > 0) {
            cssClasses.push("occupied");
         }

         if (workspace.isUrgent) {
            cssClasses.push("urgent");
         }

         if (workspace.isFocused) {
            cssClasses.push("focused");
         }

         return cssClasses;
      }
   );

   return <label cssClasses={computedCssClasses} label={`${workspaceName}`} />;
}
