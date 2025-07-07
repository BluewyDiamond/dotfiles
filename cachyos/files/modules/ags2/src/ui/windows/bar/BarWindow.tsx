import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";
import DateTimeButton from "./composables/DateTimeButton";

export default function BarWindow(gdkmonitor: Gdk.Monitor) {
   const time = createPoll("", 1000, "date");
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
            <DateTimeButton $type="center" text="time" />
            <label $type="end" cssClasses={["label"]} label="example text" />
         </centerbox>
      </window>
   );
}
