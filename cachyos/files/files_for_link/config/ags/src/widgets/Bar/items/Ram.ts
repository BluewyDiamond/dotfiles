import { bind, interval, Variable } from "astal";
import { Astal, Gtk, Widget } from "astal/gtk4";
import { getMemoryStats, MemoryStats } from "../../../utils";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";

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
            iconName: icons.system.ram,
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
