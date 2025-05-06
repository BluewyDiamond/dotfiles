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

      if (approximate !== "" && iconInLowerCase.includes(icon)) {
         approximate = iconName;
      }
   }

   return approximate;
}

function hasIconInApps(icon: string, app: Apps.Application): boolean {
   icon = icon.toLowerCase();

   const name: string | null | undefined = app.get_name();
   const entry: string | null | undefined = app.get_entry();
   const executable: string | null | undefined = app.get_executable();
   const description: string | null | undefined = app.get_description();

   const isMatch = (text: string | null | undefined): boolean => {
      const textLowerCase = text?.toLowerCase() ?? "";

      return (
         textLowerCase !== "" &&
         (textLowerCase.includes(icon) || icon.includes(textLowerCase))
      );
   };

   return (
      isMatch(name) ||
      isMatch(entry) ||
      isMatch(executable) ||
      isMatch(description)
   );
}

export function findIcon(icon: string): string {
   if (icon === "") return "";

   const theIcon = getIcon(icon);
   if (theIcon !== "") return theIcon;

   const apps = new Apps.Apps();
   const foundedApp = apps.list.find((app) => hasIconInApps(icon, app));

   if (foundedApp !== undefined) {
      if (getIcon(foundedApp.iconName) !== "") return foundedApp.iconName;
   }

   return "";
}
