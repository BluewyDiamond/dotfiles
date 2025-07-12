import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import NotificationsIndicatorButton from "./composables/NotificationsIndicatorButton";
import WorkspacesButton from "./composables/WorkspacesButton";
import DateTimeMenuButton from "./composables/DateTimeMenubutton";

export default function BarWindow(gdkmonitor: Gdk.Monitor) {
   const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

   return (
      <window
         gdkmonitor={gdkmonitor}
         name="ags_bar"
         namespace="ags_bar"
         cssClasses={["window", "bar-window"]}
         anchor={TOP | LEFT | RIGHT}
         exclusivity={Astal.Exclusivity.EXCLUSIVE}
         application={app}
         visible
      >
         <centerbox>
            <box $type="start">
               <WorkspacesButton />
            </box>

            <centerbox $type="center">
               <box $type="start">
                  <NotificationsIndicatorButton />
               </box>

               <box $type="center">
                  <DateTimeMenuButton $type="center" />
               </box>

               <box $type="end"></box>
            </centerbox>
         </centerbox>
      </window>
   );
}
