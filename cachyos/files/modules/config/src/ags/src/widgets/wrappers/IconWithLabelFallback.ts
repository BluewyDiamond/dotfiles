import { Gtk, Widget } from "astal/gtk4";
import { findIcon } from "../../utils";
import { Icon } from "../../libs/icons";

type IconWithLabelFallbackProps = {
   cssClasses?: string[];
   icon: Icon;
   fallbackIcon?: Icon;
   symbolic?: boolean;
   fallbackLabel?: string;
};

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Gtk.Image | Gtk.Label {
   const { cssClasses, icon, fallbackIcon, symbolic, fallbackLabel } = props;
   let foundedIcon = "";

   if (symbolic) {
      foundedIcon = findIcon(icon.symbolic);
   } else {
      foundedIcon = findIcon(icon.normal);
   }

   if (foundedIcon === "") {
      if (symbolic) {
         foundedIcon = findIcon(fallbackIcon?.symbolic ?? "");
      } else {
         foundedIcon = findIcon(fallbackIcon?.normal ?? "");
      }
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
