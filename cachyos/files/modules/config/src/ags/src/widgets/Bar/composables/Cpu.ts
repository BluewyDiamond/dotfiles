import { bind, interval, Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";
import GTop from "gi://GTop";

const INTERVAL = 2000;
let lastCpuStats: GTop.glibtop_cpu | null = null;
const cpuUsage: Variable<number | null> = Variable(null);

interval(INTERVAL, async () => {
   const gtopCpu = new GTop.glibtop_cpu();
   GTop.glibtop_get_cpu(gtopCpu);

   if (lastCpuStats) {
      cpuUsage.set(
         1 -
            (gtopCpu.idle - lastCpuStats.idle) /
               (gtopCpu.total - lastCpuStats.total)
      );
   } else {
      cpuUsage.set(null);
   }

   lastCpuStats = gtopCpu;
});

export default function (): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["cpu"],
      },

      Widget.Box({
         children: [
            IconWithLabelFallback({
               icon: icons.system.cpu,
               fallbackLabel: "CPU ",
            }),

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
