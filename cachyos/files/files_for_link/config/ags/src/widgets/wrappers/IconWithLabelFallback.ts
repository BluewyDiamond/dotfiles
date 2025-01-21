import { Gtk, Widget } from "astal/gtk3";
import { findIcon } from "../../utils";

type IconWithLabelFallbackProps = {
   className?: string;
   icon: string;
   fallbackIcon?: string;
   fallbackLabel?: string;
};

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Widget.Box {
   const { className, icon, fallbackIcon, fallbackLabel } = props;

   let foundedIcon = findIcon(icon);

   if (foundedIcon === "") {
      foundedIcon = findIcon(fallbackIcon || "");
   }

   function setupClassName(): string {
      return ["icon-with-label-fallback", className].filter(Boolean).join(" ");
   }

   // wrapper for easier css styling
   const box = new Widget.Box({
      className: setupClassName(),
   });

   if (foundedIcon === "") {
      box.children = [
         new Widget.Label({
            label: fallbackLabel || "?",
         }),
      ];
   } else {
      box.children = [
         new Widget.Icon({
            icon: foundedIcon,
         }),
      ];
   }

   return box;
}
