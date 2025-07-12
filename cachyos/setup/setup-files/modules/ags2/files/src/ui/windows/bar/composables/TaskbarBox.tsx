import { createBinding, createComputed, For } from "ags";
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

   return (
      <box cssClasses={["taskbar-box"]}>
         <For each={clientsComputed}>
            {(client) => (
               <button
                  cssClasses={["client-button"]}
                  onClicked={() => client.focus()}
               >
                  <image iconName={client.class} />
               </button>
            )}
         </For>
      </box>
   );
}
