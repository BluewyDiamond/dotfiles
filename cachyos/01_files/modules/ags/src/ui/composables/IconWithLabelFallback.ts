import { type Gtk, Widget } from "astal/gtk4";
import { findIcon } from "../../utils/image";
import options from "../../options";

interface IconWithLabelFallbackProps {
   cssClasses?: string[];
   iconName: string;
   label?: string;
}

export function IconWithLabelFallback(
   props: IconWithLabelFallbackProps
): Gtk.Image | Gtk.Label {
   const { cssClasses, iconName, label } = props;

   let foundedIcon = "";
   foundedIcon = findIcon(iconName);

   function setupClassName(): string[] {
      if (cssClasses === undefined) return ["icon-with-label-fallback"];
      return ["icon-with-label-fallback", ...cssClasses];
   }

   if (foundedIcon === "") {
      return Widget.Label({
         cssClasses: [...setupClassName(), "label"],
         label: label ?? options.general.fallbackLabel,
      });
   } else {
      return Widget.Image({
         cssClasses: [...setupClassName(), "image"],
         iconName: foundedIcon,
      });
   }
}
