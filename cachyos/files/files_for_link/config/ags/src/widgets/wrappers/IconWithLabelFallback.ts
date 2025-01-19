import { Widget } from "astal/gtk3";
import { findIcon } from "../../utils";

type IconWithLabelFallbackProps = {
   className?: string;
   icon: string;
   fallbackIcon?: string;
   fallbackLabel?: string;
};

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Widget.Icon | Widget.Label {
   const { className, icon, fallbackIcon, fallbackLabel } = props;

   let foundedIcon = findIcon(icon);

   if (foundedIcon === "") {
      foundedIcon = findIcon(fallbackIcon || "");
   }

   function setupClassName(): string {
      return ["icon-with-label-fallback", className].filter(Boolean).join(" ");
   }

   if (foundedIcon === "") {
      return new Widget.Label({
         className: setupClassName(),
         label: fallbackLabel || "?",
      });
   } else {
      return new Widget.Icon({
         className: setupClassName(),
         icon: foundedIcon,
      });
   }
}
