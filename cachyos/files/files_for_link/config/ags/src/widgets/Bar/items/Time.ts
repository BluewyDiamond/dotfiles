import { Astal, Widget } from "astal/gtk4";
import { GLib, Variable } from "astal";

const time = Variable<string>("").poll(
   1000,
   () => GLib.DateTime.new_now_local().format("%H:%M - %A %e.")!
);

export default function (): Astal.Label {
   return Widget.Label({
      cssClasses: ["time"],
      label: time(),
   });
}
