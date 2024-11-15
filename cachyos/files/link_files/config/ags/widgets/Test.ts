import { Widget, Gdk, Astal } from "astal/gtk3";
import Indicators from "./bar/items/Indicators";

export default function (gdkmonitor: Gdk.Monitor) {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      className: "test",
      exclusivity: Astal.Exclusivity.EXCLUSIVE,

      anchor:
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.LEFT |
         Astal.WindowAnchor.RIGHT,

      child: new Widget.Box({
         children: [Indicators()],
      }),
   });
}
