import { Widget } from "astal/gtk3";
import { IconWithLabelFallback } from "../../wrappers/IconWithLabelFallback";
import icons from "../../../libs/icons";
import { bind } from "astal/binding";
import Battery from "gi://AstalBattery";
import { timeout } from "astal";

const battery = Battery.get_default();

export default function (): Widget.Box {
   return new Widget.Box({
      className: "battery",
      visible: bind(battery, "isBattery"),

      children: [
         new Widget.Box({
            setup: (self) => {
               self.hook(battery, "notify::is-charging", () => {
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
               });
            },
         }),

         new Widget.Label({
            label: bind(battery, "percentage").as(
               (percentage) => `${percentage}%`
            ),
         }),
      ],
   });
}
