import { Astal, Gtk, Widget } from "astal/gtk4";
import { findIcon } from "../../utils";

type IconWithLabelFallbackProps = {
   cssClasses?: string[];
   iconName: string;
   fallbackIcon?: string;
   fallbackLabel?: string;
};

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Astal.Box {
   const { cssClasses, iconName, fallbackIcon, fallbackLabel } = props;

   let foundedIcon = findIcon(iconName);

   if (foundedIcon === "") {
      foundedIcon = findIcon(fallbackIcon || "");
   }

   function setupClassName(): string[] {
      if (!cssClasses) return ["icon-with-label-fallback"];
      return ["icon-with-label-fallback", ...cssClasses];
   }

   // wrapper for easier css styling
   const box = Widget.Box({
      cssClasses: setupClassName(),
   });

   if (foundedIcon === "") {
      box.children = [
         Widget.Label({
            label: fallbackLabel || "?",
         }),
      ];
   } else {
      box.children = [
         Widget.Image({
            iconName: foundedIcon,
         }),
      ];
   }

   return box;
}
