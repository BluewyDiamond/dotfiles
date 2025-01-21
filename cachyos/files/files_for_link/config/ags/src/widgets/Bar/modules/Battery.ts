import { Widget } from "astal/gtk3";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../icons";
import { bind } from "astal/binding";
import Battery from "gi://AstalBattery";

const battery = Battery.get_default();

export default function (): Widget.Box {
   return new Widget.Box({
      className: "battery",
      visible: bind(battery, "isBattery"),

      children: [
         new Widget.Box({
            setup: (self) => {
               function onChargingChanged() {
                  if (battery.charging) {
                     self.children = [
                        IconWithLabelFallback({
                           icon: icons.battery.charging.default,
                        }),
                     ];
                  } else {
                     self.children = [
                        IconWithLabelFallback({ icon: icons.battery.default }),
                     ];
                  }
               }

               onChargingChanged();

               self.hook(battery, "notify::charging", () =>
                  onChargingChanged()
               );
            },
         }),

         new Widget.Label({
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
