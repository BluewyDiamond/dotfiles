import { bind, interval, Variable } from "astal";
import { Widget } from "astal/gtk3";
import { CpuStats, getCpuStats } from "../../../utils";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";

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

export default function (): Widget.Button {
   return new Widget.Button(
      {
         className: "cpu",
      },

      new Widget.Box({
         children: [
            IconWithLabelFallback({ icon: "", fallbackLabel: "CPU " }),

            new Widget.Label({
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
