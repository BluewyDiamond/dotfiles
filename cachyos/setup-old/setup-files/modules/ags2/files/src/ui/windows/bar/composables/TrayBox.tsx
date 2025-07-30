import { createBinding, For } from "ags";
import AstalTray from "gi://AstalTray";

const tray = AstalTray.get_default();

export default function () {
   const trayItemsBinding = createBinding(tray, "items");

   return (
      <box cssClasses={["tray-box"]}>
         <For each={trayItemsBinding}>
            {(trayItem) => <image gicon={trayItem.gicon} />}
         </For>
      </box>
   );
}
