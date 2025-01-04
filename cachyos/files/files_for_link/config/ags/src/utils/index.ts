import icons, { substitutes } from "../libs/icons";
import { Astal, Gtk } from "astal/gtk3";
import GLib from "gi://GLib";
import Apps from "gi://AstalApps";

export function isValidIcon(icon: string): boolean {
   return (
         GLib.file_test(icon, GLib.FileTest.EXISTS) ||
            Astal.Icon.lookup_icon(icon)
      ) ?
         true
      :  false;
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
   if (!icon) {
      return "";
   }

   if (isValidIcon(icon)) {
      return icon;
   }

   const apps = new Apps.Apps();
   const foundedApp = apps.list.find((app) => hasIconInApps(icon, app));

   if (foundedApp && isValidIcon(foundedApp?.iconName)) {
      return foundedApp.iconName;
   }

   if (isValidIcon(icon + "-symbolic")) {
      return icon + "-symbolic";
   }

   const substitute = substitutes[icon];

   if (!substitute) {
      return "";
   }

   if (isValidIcon(substitute)) {
      return substitute;
   }

   return "";
}
