import { Accessor, createBinding, For } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import AstalNotifd from "gi://AstalNotifd";

const notifd = AstalNotifd.get_default();

export default function ({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
   const notificationsBinding = createBinding(notifd, "notifications");

   return (
      <window
         gdkmonitor={gdkmonitor}
         name="ags_control_center"
         namespace="ags_control_center"
         cssClasses={["control-center-window"]}
         anchor={
            Astal.WindowAnchor.TOP |
            Astal.WindowAnchor.RIGHT |
            Astal.WindowAnchor.BOTTOM |
            Astal.WindowAnchor.LEFT
         }
         exclusivity={Astal.Exclusivity.EXCLUSIVE}
         application={app}
      >
         <box>
            <box cssClasses={["quick-settings-box"]} hexpand>
               <label label="placeholder" />
            </box>

            <box
               cssClasses={["notifications-box"]}
               hexpand
               orientation={Gtk.Orientation.VERTICAL}
            >
               <button
                  onClicked={() =>
                     notifd.notifications.forEach((notification) =>
                        notification.dismiss()
                     )
                  }
               >
                  <label label="Clear" />
               </button>

               <For each={notificationsBinding}>
                  {(notification) => (
                     <box orientation={Gtk.Orientation.VERTICAL}>
                        <label label={notification.summary} />
                        <label label={notification.body} />
                     </box>
                  )}
               </For>
            </box>
         </box>
      </window>
   );
}
