import { Widget } from "astal/gtk3";
import { curateIcon } from "../utils";
import icons, { substitutes } from "../libs/icons";

export function IconWithLabelFallback(
   value: string
): Widget.Icon | Widget.Label {
   let curatedIcon = curateIcon(value);

   if (curatedIcon === "") {
      curatedIcon = curateIcon(icons.fallback.executable);
   }

   if (curatedIcon === "") {
      return new Widget.Label({
         label: "?",
      });
   } else {
      return new Widget.Icon({
         icon: curatedIcon,
      });
   }
}
