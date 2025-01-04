import { Widget } from "astal/gtk3";
import { findIcon } from "../../utils";
import icons from "../../libs/icons";
import { IconProps, LabelProps } from "astal/gtk3/widget";

type IconWithLabelFallbackProps = {
   icon: string;
   fallbackIcon?: string;
   fallbackLabel?: string;
   iconProps?: IconProps;
   labelProps?: LabelProps;
};

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Widget.Icon | Widget.Label {
   const { icon, fallbackIcon, fallbackLabel, iconProps, labelProps } = props;

   let foundedIcon = findIcon(icon);

   if (foundedIcon === "") {
      foundedIcon = findIcon(fallbackIcon || "");
   }

   if (foundedIcon === "") {
      return new Widget.Label({
         label: fallbackLabel || "?",
         ...labelProps,
      });
   } else {
      return new Widget.Icon({
         icon: foundedIcon,
         ...iconProps,
      });
   }
}
