import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";

export default function () {
   const datetime = createPoll("", 1000, 'date +"%a %d %b - %H:%M"');

   return (
      <menubutton
         $type="end"
         cssClasses={["date-time-menubutton"]}
         hexpand
         halign={Gtk.Align.CENTER}
      >
         <label cssClasses={["label"]} label={datetime} />

         <popover>
            <Gtk.Calendar />
         </popover>
      </menubutton>
   );
}
