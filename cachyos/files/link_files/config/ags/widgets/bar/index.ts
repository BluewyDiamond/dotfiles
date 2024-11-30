import { Gdk, Widget, Astal, Gtk } from "astal/gtk3";
import Indicators from "./items/indicators";

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
            hexpand: true,
            halign: Gtk.Align.START,
            children: [
               new Widget.Box({
                  children: []
               })
            ],
         }),

         centerWidget: new Widget.Box({
            children: [],
         }),

         endWidget: new Widget.Box({
            hexpand: true,
            halign: Gtk.Align.END,
            children: [Indicators()],
         }),
      }),
   });
}