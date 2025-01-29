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

   // The Gtk4.Image
   // does not accept icon names with extension at the end.
   if (foundedIcon === "") {
      const lastDotIndex = foundedIcon.lastIndexOf(".");

      if (lastDotIndex > 0) {
         foundedIcon = foundedIcon.substring(0, lastDotIndex);
      }

      foundedIcon = findIcon(foundedIcon);
   }

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
