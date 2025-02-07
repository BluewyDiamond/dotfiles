import { type Gtk, Widget } from "astal/gtk4";
import { GLib, Variable } from "astal";

const time = Variable<string>("").poll(
   1000,
   () => GLib.DateTime.new_now_local().format("%H:%M - %A %e.") ?? "?"
);

export default function (): Gtk.Label {
   return Widget.Label({
      cssClasses: ["time"],
      label: time(),
   });
}
