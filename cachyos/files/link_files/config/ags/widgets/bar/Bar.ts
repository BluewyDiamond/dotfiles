import { Gdk, Widget, Astal } from "astal/gtk3";
import Indicators from "./items/Indicators";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      className: "bar",
      exclusivity: Astal.Exclusivity.EXCLUSIVE,

      anchor:
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.LEFT |
         Astal.WindowAnchor.RIGHT,

      child: new Widget.CenterBox({
         startWidget: new Widget.Box({
            children: [
               new Widget.Button({
                  label: "This is a button.",
               }),

               Indicators(),
            ],
         }),
      }),
   });
}
