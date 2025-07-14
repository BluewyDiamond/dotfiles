import AstalHyprland from "gi://AstalHyprland";
import options from "../../../../options";
import {
   Accessor,
   createBinding,
   createComputed,
   createState,
   onCleanup,
} from "ags";

const hyprland = AstalHyprland.get_default();

export default function () {
   return (
      <button cssClasses={["workspaces-button"]}>
         <box>
            {options.hyprland.workspaces.map((workspaceNumber) => (
               <WorkspaceLabel workspaceNumber={workspaceNumber} />
            ))}
         </box>
      </button>
   );
}

function WorkspaceLabel({ workspaceNumber }: { workspaceNumber: number }) {
   const focusedWorkspaceBinding = createBinding(
      hyprland,
      "focusedWorkspace"
   ) as Accessor<AstalHyprland.Workspace | null>;

   const focusedClientBinding = createBinding(hyprland, "focusedClient");

   const [urgentClientsState, setUrgentClientsState] = createState<
      AstalHyprland.Client[]
   >([]);

   const urgentClientSignalId = hyprland.connect(
      "urgent",

      (_, client: AstalHyprland.Client | null) => {
         if (client === null) {
            return;
         }

         setUrgentClientsState((previousUrgentClients) => [
            ...previousUrgentClients,
            client,
         ]);
      }
   );

   const unsubscribeFocusedClientBinding = focusedClientBinding.subscribe(
      () => {
         const focusedClient =
            hyprland.get_focused_client() as AstalHyprland.Client | null;

         if (focusedClient === null) {
            return;
         }

         setUrgentClientsState((previousUrgentClients) =>
            previousUrgentClients.filter(
               (previousUrgentClient) =>
                  previousUrgentClient.pid !== focusedClient.pid
            )
         );
      }
   );

   onCleanup(() => {
      hyprland.disconnect(urgentClientSignalId);
      unsubscribeFocusedClientBinding();
   });

   const computedCssClasses = createComputed(
      [focusedWorkspaceBinding, urgentClientsState],

      (focusedWorkspace, urgentClients) => {
         const cssClasses = ["workspace-label"];

         if (focusedWorkspace === null) {
            return cssClasses;
         }

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

         if (
            urgentClients.find((urgentClient) => {
               const urgentWorkspace =
                  urgentClient.get_workspace() as AstalHyprland.Workspace | null;

               if (urgentWorkspace === null) {
                  return false;
               }

               return urgentWorkspace.id === workspace.id;
            }) !== undefined
         ) {
            cssClasses.push("urgent");
         }

         return cssClasses;
      }
   );

   return (
      <label cssClasses={computedCssClasses} label={`${workspaceNumber}`} />
   );
}
