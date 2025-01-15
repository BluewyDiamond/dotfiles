import { bind, interval, Variable } from "astal";
import { Widget } from "astal/gtk3";
import { getCpuUsage } from "../../../utils";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";

const INTERVAL = 2000;
const cpuUsage: Variable<number | null> = Variable(null);
interval(INTERVAL, async () => cpuUsage.set(await getCpuUsage()));

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
