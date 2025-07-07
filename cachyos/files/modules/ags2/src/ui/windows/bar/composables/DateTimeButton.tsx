import { Gtk } from "ags/gtk4";

export default function ({ text }: { text: string }) {
   return (
      <menubutton $type="end" hexpand halign={Gtk.Align.CENTER}>
         <label cssClasses={["label"]} label={text} />

         <popover>
            <Gtk.Calendar />
         </popover>
      </menubutton>
   );
}
