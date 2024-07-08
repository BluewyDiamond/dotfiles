import icons, { substitutes } from "libs/icons";
import GLib from "gi://GLib?version=2.0";

export default (name: string | null, fallback = icons.missing): string => {
   if (!name) return fallback || "";

   if (GLib.file_test(name, GLib.FileTest.EXISTS)) return name;

   const icon = substitutes[name] || name;
   if (Utils.lookUpIcon(icon)) return icon;

   print(`no icon substitute "${icon}" for "${name}", fallback: "${fallback}"`);
   return fallback;
};
