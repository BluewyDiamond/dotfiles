import { Widget } from "astal/gtk3";
import { GLib, Variable } from "astal";

export default function (): Widget.Label {
   const time = Variable<string>("").poll(
      1000,
      () => GLib.DateTime.new_now_local().format("%H:%M - %A %e.")!
   );

   return new Widget.Label({
      className: "datetime",
      label: time(),
   });
}
