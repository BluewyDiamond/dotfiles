import { bind, interval, Variable } from "astal";
import { Astal, Widget } from "astal/gtk4";
import { CpuStats, getCpuStats } from "../../../utils";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";

const INTERVAL = 2000;
let last: CpuStats | null = null;
const cpuUsage: Variable<number | null> = Variable(null);

interval(INTERVAL, async () => {
   const now = await getCpuStats();

   if (!now) {
      return;
   }

   if (last) {
      cpuUsage.set(1 - (now.idle - last.idle) / (now.total - last.total));
   }

   last = now;
});

export default function (): Astal.Button {
   return Widget.Button(
      {
         cssClasses: ["cpu"],
      },

      Widget.Box({
         children: [
            IconWithLabelFallback({ iconName: "", fallbackLabel: "CPU " }),

            Widget.Label({
               label: bind(cpuUsage).as((cpuUsage) => {
                  if (!cpuUsage) {
                     return "?";
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
