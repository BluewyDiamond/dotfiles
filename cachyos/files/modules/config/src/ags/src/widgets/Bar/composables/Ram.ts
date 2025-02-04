import { bind, interval, Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";
import GTop from "gi://GTop";

const INTERVAL = 2000;

function getGtopMem(): GTop.glibtop_mem {
   const gtopMem = new GTop.glibtop_mem();
   GTop.glibtop_get_mem(gtopMem);
   return gtopMem;
}

const gtopMemVariable: Variable<GTop.glibtop_mem> = Variable(getGtopMem());

interval(INTERVAL, async () => {
   gtopMemVariable.set(getGtopMem());
});

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["_ram"],
      },

      Widget.Box(
         {},

         IconWithLabelFallback({
            icon: icons.system.ram,
            fallbackLabel: "RAM ",
         }),

         Widget.Label({
            label: bind(gtopMemVariable).as((gtopMem) => {
               return `${Math.ceil(
                  (1 -
                     (gtopMem.free + gtopMem.buffer + gtopMem.cached) /
                        gtopMem.total) *
                     100
               )
                  .toString()
                  .padStart(3, "_")}%`;
            }),
         })
      )
   );
}
