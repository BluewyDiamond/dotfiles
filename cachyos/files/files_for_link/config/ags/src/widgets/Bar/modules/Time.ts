import { Widget } from "astal/gtk3";
import { GLib, Variable } from "astal";

const time = Variable<string>("").poll(
   1000,
   () => GLib.DateTime.new_now_local().format("%H:%M - %A %e.")!
);

export default function (): Widget.Label {
   return new Widget.Label({
      className: "time",
      label: time(),
   });
}
