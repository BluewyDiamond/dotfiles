import GLib from "gi://GLib";
import Apps from "gi://AstalApps";
import { Gtk } from "astal/gtk4";
import options from "../options";

const gtkIconTheme = new Gtk.IconTheme();
// without it it does not find the icons
gtkIconTheme.set_theme_name(options.theme.icons);

export function isValidImage(image: string): boolean {
   if (GLib.file_test(image, GLib.FileTest.EXISTS)) {
      return true;
   } else if (gtkIconTheme.has_icon(image)) {
      return true;
   } else {
      return false;
   }
}

export function hasIconInApps(icon: string, app: Apps.Application): boolean {
   const iconInLowerCase = icon.toLowerCase();
   const name = app.get_name()?.toLowerCase();
   const entry = app.get_entry()?.toLowerCase();
   const executable = app.get_executable()?.toLowerCase();
   const description = app.get_description()?.toLowerCase();

   if (
      name &&
      (name.includes(iconInLowerCase) || iconInLowerCase.includes(name))
   ) {
      return true;
   }

   if (
      entry &&
      (entry.includes(iconInLowerCase) || iconInLowerCase.includes(entry))
   ) {
      return true;
   }

   if (
      executable &&
      (executable.includes(iconInLowerCase) ||
         iconInLowerCase.includes(executable))
   ) {
      return true;
   }

   if (
      description &&
      (description.includes(iconInLowerCase) ||
         iconInLowerCase.includes(description))
   ) {
      return true;
   }

   return false;
}

export function findIcon(icon: string): string {
   if (!icon) return "";
   if (isValidImage(icon)) return icon;

   const apps = new Apps.Apps();
   const foundedApp = apps.list.find((app) => hasIconInApps(icon, app));

   if (foundedApp)
      if (isValidImage(foundedApp.iconName)) return foundedApp.iconName;

   return "";
}
