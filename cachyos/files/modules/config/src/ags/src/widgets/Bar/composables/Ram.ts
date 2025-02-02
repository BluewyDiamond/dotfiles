import { bind, interval, Variable } from "astal";
import { Astal, Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";
import { getMemoryStats, MemoryStats } from "../../../utils/hardware";

const INTERVAL = 2000;
const memoryStats: Variable<MemoryStats | null> = Variable(null);
interval(INTERVAL, async () => memoryStats.set(await getMemoryStats()));

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
            label: bind(memoryStats).as((memoryStats) => {
               if (!memoryStats) {
                  return "???";
               }

               return `${Math.ceil(memoryStats.usage * 100)
                  .toString()
                  .padStart(3, "_")}%`;
            }),
         })
      )
   );
}
