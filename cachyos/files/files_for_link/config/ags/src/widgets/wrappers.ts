import { Widget } from "astal/gtk3";
import { curateIcon } from "../utils";
import icons from "../libs/icons";

type Props = {
   setup?(self: Widget.Icon | Widget.Label): void ;
};

export function IconWithLabelFallback(
   value: string,
   props: Props
): Widget.Icon | Widget.Label {
   let curatedIcon = curateIcon(value);

   if (curatedIcon === "") {
      curatedIcon = curateIcon(icons.fallback.executable);
   }

   if (curatedIcon === "") {
      return new Widget.Label({
         label: "?",
         setup: props.setup,
      });
   } else {
      return new Widget.Icon({
         icon: curatedIcon,
         setup: props.setup,
      });
   }
}
