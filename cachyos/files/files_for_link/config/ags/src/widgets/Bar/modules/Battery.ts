import { Astal, hook, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";
import { bind } from "astal/binding";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export default function (): Astal.Box {
   return Widget.Box({
      className: "battery",
      visible: bind(battery, "isBattery"),

      children: [
         Widget.Box({
            setup: (self) => {
               function onChargingChanged() {
                  if (battery.charging) {
                     self.children = [
                        IconWithLabelFallback({
                           iconName: icons.battery.charging.default,
                        }),
                     ];
                  } else {
                     self.children = [
                        IconWithLabelFallback({ iconName: icons.battery.default }),
                     ];
                  }
               }

               onChargingChanged();

               hook(self, battery, "notify::charging", () =>
                  onChargingChanged()
               );
            },
         }),

         Widget.Label({
            label: bind(battery, "percentage").as(
               (percentage) =>
                  `${Math.floor(percentage * 100)
                     .toString()
                     .padStart(3, "_")}%`
            ),
         }),
      ],
   });
}
