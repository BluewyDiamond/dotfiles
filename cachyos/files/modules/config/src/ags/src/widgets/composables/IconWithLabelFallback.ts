import { type Gtk, Widget } from "astal/gtk4";
import type { Icon } from "../../libs/icons";
import { findIcon } from "../../utils/image";

interface IconWithLabelFallbackProps {
   cssClasses?: string[];
   icon: Icon;
   symbolic?: boolean;
   fallbackIcon?: Icon;
   fallbackIconIsSymbolic?: boolean;
   fallbackLabel?: string;
}

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Gtk.Image | Gtk.Label {
   const {
      cssClasses,
      icon,
      symbolic,
      fallbackIcon,
      fallbackIconIsSymbolic,
      fallbackLabel,
   } = props;
   let foundedIcon = "";

   if (symbolic === undefined) {
      foundedIcon = findIcon(icon.symbolic);
   } else {
      foundedIcon = findIcon(icon.normal);
   }

   if (foundedIcon === "") {
      if (fallbackIconIsSymbolic) {
         foundedIcon = findIcon(fallbackIcon?.symbolic ?? "");
      } else {
         foundedIcon = findIcon(fallbackIcon?.normal ?? "");
      }
   }

   function setupClassName(): string[] {
      if (cssClasses === undefined) return ["icon-with-label-fallback"];
      return ["icon-with-label-fallback", ...cssClasses];
   }

   if (foundedIcon === "") {
      return Widget.Label({
         cssClasses: [...setupClassName(), "label"],
         label: fallbackLabel ?? "?",
      });
   } else {
      return Widget.Image({
         cssClasses: [...setupClassName(), "image"],
         iconName: foundedIcon,
      });
   }
}
