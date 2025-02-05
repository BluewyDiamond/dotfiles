import { bind, interval, timeout, Variable } from "astal";
import { Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";
import GTop from "gi://GTop";

const INTERVAL = 2000;

function getGtopCpu(): GTop.glibtop_cpu {
   const gtopCpu = new GTop.glibtop_cpu();
   GTop.glibtop_get_cpu(gtopCpu);
   return gtopCpu;
}

function calculateCpuUsage(
   now: GTop.glibtop_cpu,
   previous: GTop.glibtop_cpu
): number {
   const totalDifference = now.total - previous.total;

   if (totalDifference === 0) {
      return 0;
   }

   return 1 - (now.idle - previous.idle) / totalDifference;
}

let lastCpuStats = getGtopCpu();

const cpuUsage: Variable<number> = Variable(
   calculateCpuUsage(getGtopCpu(), lastCpuStats)
);

const updateCpuUsage = () => {
   const gtopCpu = new GTop.glibtop_cpu();
   GTop.glibtop_get_cpu(gtopCpu);
   cpuUsage.set(calculateCpuUsage(gtopCpu, lastCpuStats));
   lastCpuStats = gtopCpu;
};

updateCpuUsage();
timeout(INTERVAL, () => interval(INTERVAL, () => updateCpuUsage()));

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
                  return `${Math.ceil(cpuUsage * 100)
                     .toString()
                     .padStart(3, "_")}%`;
               }),
            }),
         ],
      })
   );
}
