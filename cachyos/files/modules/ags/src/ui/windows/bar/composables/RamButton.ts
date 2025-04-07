import { bind, interval, Variable } from "astal";
import { type Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../../composables/IconWithLabelFallback";
import icons from "../../../../libs/icons";
import GTop from "gi://GTop";

const INTERVAL = 2000;

function getGtopMem(): GTop.glibtop_mem {
   const gtopMem = new GTop.glibtop_mem();
   GTop.glibtop_get_mem(gtopMem);
   return gtopMem;
}

const gtopMemVariable: Variable<GTop.glibtop_mem> = Variable(getGtopMem());

interval(INTERVAL, () => {
   gtopMemVariable.set(getGtopMem());
});

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["bar-item", "bar-item-ram"],
      },

      Widget.Box(
         {},

         IconWithLabelFallback({
            iconName: icons.system.ram.symbolic,
         }),

         Widget.Label({
            label: bind(gtopMemVariable).as(
               (gtopMem) =>
                  `${Math.ceil(
                     (1 -
                        (gtopMem.free + gtopMem.buffer + gtopMem.cached) /
                           gtopMem.total) *
                        100
                  )
                     .toString()
                     .padStart(3, "_")}%`
            ),
         })
      )
   );
}
