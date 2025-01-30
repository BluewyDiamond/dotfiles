import { Gtk, Widget } from "astal/gtk4";
import { findIcon } from "../../utils";

type IconWithLabelFallbackProps = {
   cssClasses?: string[];
   iconName: string;
   fallbackIcon?: string;
   fallbackLabel?: string;
};

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Gtk.Image | Gtk.Label {
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

   if (foundedIcon === "") {
      return Widget.Label({
         cssClasses: [...setupClassName(), "label"],
         label: fallbackLabel || "?",
      });
   } else {
      return Widget.Image({
         cssClasses: [...setupClassName(), "image"],
         iconName: foundedIcon,
      });
   }
}
