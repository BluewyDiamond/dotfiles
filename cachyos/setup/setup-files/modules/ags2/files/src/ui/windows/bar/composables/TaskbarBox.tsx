import {
   createBinding,
   createComputed,
   createState,
   For,
   onCleanup,
} from "ags";
import AstalHyprland from "gi://AstalHyprland";

const hyprland = AstalHyprland.get_default();

export default function () {
   const clientsBinding = createBinding(hyprland, "clients");

   const clientsComputed = createComputed([clientsBinding], (clients) => {
      return clients.sort(
         (clientA, clientB) =>
            clientA.get_workspace().id - clientB.get_workspace().id
      );
   });

   const [urgentClientsState, setUrgentClientsState] = createState<
      AstalHyprland.Client[]
   >([]);

   const urgentClientSignalId = hyprland.connect(
      "urgent",
      (client: AstalHyprland.Client) => {
         const urgentClients: AstalHyprland.Client[] = [];
         urgentClients.push(client);

         setUrgentClientsState((previousUrgentClients) => [
            ...previousUrgentClients,
            client,
         ]);
      }
   );

   onCleanup(() => hyprland.disconnect(urgentClientSignalId));

   return (
      <box cssClasses={["taskbar-box"]}>
         <For each={clientsComputed}>
            {(client) => (
               <button
                  cssClasses={createComputed(
                     [urgentClientsState],

                     (urgentClients) => {
                        if (
                           urgentClients.find(
                              (urgentClient) => urgentClient.pid === client.pid
                           )
                        ) {
                           return ["urgent"];
                        } else {
                           return [];
                        }
                     }
                  )}
                  onClicked={() => client.focus()}
               >
                  <image iconName={client.class} />
               </button>
            )}
         </For>
      </box>
   );
}
