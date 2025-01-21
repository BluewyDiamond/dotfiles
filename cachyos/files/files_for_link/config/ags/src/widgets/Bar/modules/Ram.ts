import { bind, interval, Variable } from "astal";
import { Widget } from "astal/gtk3";
import { getMemoryStats, MemoryStats } from "../../../utils";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";

const INTERVAL = 2000;
const memoryStats: Variable<MemoryStats | null> = Variable(null);
interval(INTERVAL, async () => memoryStats.set(await getMemoryStats()));

export default function (): Widget.Button {
   return new Widget.Button(
      {
         className: "_ram",
      },

      new Widget.Box(
         {},

         IconWithLabelFallback({
            icon: "",
            fallbackLabel: "RAM ",
         }),

         new Widget.Label({
            label: bind(memoryStats).as((memoryStats) => {
               if (!memoryStats) {
                  return "?";
               }

               return `${Math.ceil(memoryStats.usage * 100)
                  .toString()
                  .padStart(3, "_")}%`;
            }),
         })
      )
   );
}
