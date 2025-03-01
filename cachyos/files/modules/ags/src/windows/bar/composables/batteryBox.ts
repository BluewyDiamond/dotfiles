import { type Astal, hook, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../composables/iconWithLabelFallback";
import icons from "../../../libs/icons";
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
      cssClasses: ["bar-item", "bar-item-battery"],
      visible: bind(battery, "isBattery"),

      setup: (self) => {
         const onChargingChanged = (): void => {
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
         };

         onChargingChanged();

         hook(self, battery, "notify::charging", () => {
            onChargingChanged();
         });
      },
   });
}
