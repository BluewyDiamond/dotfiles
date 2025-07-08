import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";
import DateTimeButton from "./composables/DateTimeButton";
import NotificationsIndicatorButton from "./composables/NotificationsIndicatorButton";

export default function BarWindow(gdkmonitor: Gdk.Monitor) {
   const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

   return (
      <window
         visible
         name="bar"
         namespace="name_to_be_changed"
         cssClasses={["window", "BarWindow"]}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.EXCLUSIVE}
         anchor={TOP | LEFT | RIGHT}
         application={app}
      >
         <centerbox cssClasses={["centerbox"]}>
            <NotificationsIndicatorButton $type="start" />
            <DateTimeButton $type="center" />
            <label $type="end" cssClasses={["label"]} label="example text" />
         </centerbox>
      </window>
   );
}
