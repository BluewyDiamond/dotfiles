import {
   Accessor,
   createBinding,
   createComputed,
   createState,
   For,
   onCleanup,
} from "ags";
import AstalHyprland from "gi://AstalHyprland";
import options from "../../../../options";

const hyprland = AstalHyprland.get_default();

export default function () {
   const clientsBinding = createBinding(hyprland, "clients");

   const focusedClientBinding = createBinding(
      hyprland,
      "focusedClient"
   ) as Accessor<AstalHyprland.Client | null>;

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
                  previousUrgentClient.address !== focusedClient.address
            )
         );
      }
   );

   onCleanup(() => {
      hyprland.disconnect(urgentClientSignalId);
      unsubscribeFocusedClientBinding();
   });

   const clientsComputed = createComputed([clientsBinding], (clients) => {
      return clients.sort(
         (clientA, clientB) =>
            clientA.get_workspace().id - clientB.get_workspace().id
      );
   });

   return (
      <box cssClasses={["taskbar-box"]}>
         <For each={clientsComputed}>
            {(client) => (
               <button
                  cssClasses={createComputed(
                     [focusedClientBinding, urgentClientsState],

                     (focusedClient, urgentClients) => {
                        const cssClasses = ["taskbar-client-button"];

                        if (focusedClient === null) {
                           return cssClasses;
                        }

                        if (focusedClient.address === client.address) {
                           cssClasses.push("active");
                        }

                        if (
                           urgentClients.find(
                              (urgentClient) =>
                                 urgentClient.address === client.address
                           ) !== undefined
                        ) {
                           console.log("true");
                           cssClasses.push("urgent");
                        }

                        return cssClasses;
                     }
                  )}
                  onClicked={() => client.focus()}
               >
                  <image
                     iconName={
                        options.bar.taskbar.flat ?
                           client.class + "symbolic"
                        :  client.class
                     }
                  />
               </button>
            )}
         </For>
      </box>
   );
}
