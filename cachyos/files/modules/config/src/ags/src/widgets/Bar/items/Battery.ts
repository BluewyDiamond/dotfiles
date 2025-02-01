import { Astal, hook, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";
import { bind } from "astal/binding";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export default function (): Astal.Box {
   const label = Widget.Label({
      label: bind(battery, "percentage").as(
         (percentage) =>
            `${Math.floor(percentage * 100)
               .toString()
               .padStart(3, "_")}%`
      ),
   });

   return Widget.Box({
      cssClasses: ["battery"],
      visible: bind(battery, "isBattery"),

      setup: (self) => {
         function onChargingChanged() {
            if (battery.charging) {
               self.children = [
                  IconWithLabelFallback({
                     icon: icons.battery.charging.default,
                  }),

                  label,
               ];
            } else {
               self.children = [
                  IconWithLabelFallback({ icon: icons.battery.default }),
                  label,
               ];
            }
         }

         onChargingChanged();

         hook(self, battery, "notify::charging", () => onChargingChanged());
      },
   });
}
