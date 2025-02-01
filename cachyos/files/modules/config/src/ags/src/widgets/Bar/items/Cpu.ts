import { bind, interval, Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";
import { CpuStats, getCpuStats } from "../../../utils";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";

const INTERVAL = 2000;
let lastCpuStats: CpuStats | null = null;
const cpuUsage: Variable<number | null> = Variable(null);

interval(INTERVAL, async () => {
   const cpuStats = await getCpuStats();

   if (cpuStats) {
      if (lastCpuStats) {
         cpuUsage.set(
            1 -
               (cpuStats.idle - lastCpuStats.idle) /
                  (cpuStats.total - lastCpuStats.total)
         );
      } else {
         cpuUsage.set(null);
      }
   }

   lastCpuStats = cpuStats;
});

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["cpu"],
      },

      Widget.Box({
         children: [
            IconWithLabelFallback({ icon: icons.system.cpu, fallbackLabel: "CPU " }),

            Widget.Label({
               label: bind(cpuUsage).as((cpuUsage) => {
                  if (!cpuUsage) {
                     return "???%";
                  }

                  return `${Math.ceil(cpuUsage * 100)
                     .toString()
                     .padStart(3, "_")}%`;
               }),
            }),
         ],
      })
   );
}
