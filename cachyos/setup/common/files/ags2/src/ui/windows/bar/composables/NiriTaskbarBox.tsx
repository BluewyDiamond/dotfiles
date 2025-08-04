import {
   Accessor,
   createBinding,
   createComputed,
   createConnection,
   For,
} from "ags";
import options from "../../../../options";
import AstalNiri from "gi://AstalNiri";

const niri = AstalNiri.get_default();
const windowsBinding = createBinding(niri, "windows");

const windowsComputed = createComputed([windowsBinding], (windows) => {
   return windows.sort((windowA, windowB) => {
      const workspaceA = windowA.get_workspace();
      const workspaceB = windowB.get_workspace();
      if (workspaceA === null) return -1;
      if (workspaceB === null) return 1;

      return workspaceA.id - workspaceB.id;
   });
});

const focusedWindowBinding = createBinding(
   niri,
   "focusedWindow"
) as Accessor<AstalNiri.Window | null>;

export default function () {
   return (
      <box cssClasses={["taskbar-box"]}>
         <For each={windowsComputed}>
            {(window) => <WindowButton window={window} />}
         </For>
      </box>
   );
}

function WindowButton({ window }: { window: AstalNiri.Window }) {
   const urgentConnection = createConnection(0, [
      window,
      "notify::is-urgent",
      () => 0,
   ]);

   const cssClasses = createComputed(
      [focusedWindowBinding, urgentConnection],

      (focusedWindow, _) => {
         const cssClasses = ["taskbar-client-button"];

         if (window.isUrgent) {
            cssClasses.push("urgent");
         }

         if (focusedWindow !== null) {
            if (focusedWindow.id === window.id) {
               cssClasses.push("active");
            }
         }

         return cssClasses;
      }
   );

   return (
      <button cssClasses={cssClasses} onClicked={() => window.focus(window.id)}>
         <image
            iconName={
               // TODO: handle null lol
               options.bar.taskbar.flat ?
                  window.get_app_id()! + "symbolic"
               :  window.get_app_id()!
            }
         />
      </button>
   );
}
