import { createBinding, For } from "ags";
import AstalTray from "gi://AstalTray";

const tray = AstalTray.get_default();

export default function () {
   const trayItemsBinding = createBinding(tray, "items");

   return (
      <box cssClasses={["tray-box"]}>
         <For each={trayItemsBinding}>
            {(trayItem) => (
               <menubutton
                  $={(self) => {
                     self.insert_action_group("dbusmenu", trayItem.actionGroup);
                  }}
                  tooltipMarkup={trayItem.tooltipMarkup}
                  menuModel={trayItem.menuModel}
               >
                  <image gicon={trayItem.gicon} />
               </menubutton>
            )}
         </For>
      </box>
   );
}
