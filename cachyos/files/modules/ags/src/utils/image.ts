import Apps from "gi://AstalApps";
import { Gtk } from "astal/gtk4";
import options from "../options";

const gtkIconTheme = new Gtk.IconTheme();
// without it it does not find the icons
gtkIconTheme.set_theme_name(options.general.icons);

export function getIcon(icon: string): string {
   icon = icon.toLowerCase();
   let approximate = "";

   for (const iconName of gtkIconTheme.iconNames) {
      const iconInLowerCase = iconName.toLowerCase();

      if (iconInLowerCase === icon) {
         return iconName;
      }

      if (!approximate && iconInLowerCase.includes(icon)) {
         approximate = iconName;
      }
   }

   return approximate;
}

export function hasIconInApps(icon: string, app: Apps.Application): boolean {
   icon = icon.toLowerCase();
   const name = app.get_name()?.toLowerCase();
   const entry = app.get_entry()?.toLowerCase();
   const executable = app.get_executable()?.toLowerCase();
   const description = app.get_description()?.toLowerCase();

   if (name && (name.includes(icon) || icon.includes(name))) {
      return true;
   }

   if (entry && (entry.includes(icon) || icon.includes(entry))) {
      return true;
   }

   if (executable && (executable.includes(icon) || icon.includes(executable))) {
      return true;
   }

   if (
      description &&
      (description.includes(icon) || icon.includes(description))
   ) {
      return true;
   }

   return false;
}

export function findIcon(icon: string): string {
   if (icon === "") return "";

   const theIcon = getIcon(icon);
   if (theIcon === "") return theIcon;

   const apps = new Apps.Apps();
   const foundedApp = apps.list.find((app) => hasIconInApps(icon, app));

   if (foundedApp !== undefined) {
      if (getIcon(foundedApp.iconName) !== "") return foundedApp.iconName;
   }

   return "";
}
