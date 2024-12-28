import icons, { substitutes } from "../libs/icons";
import { Astal, Gtk } from "astal/gtk3";
import GLib from "gi://GLib";
import Apps from "gi://AstalApps";

function checkIconExists(icon: string): boolean {
   return (
         GLib.file_test(icon, GLib.FileTest.EXISTS) ||
            Astal.Icon.lookup_icon(icon)
      ) ?
         true
      :  false;
}

export function searchIcon(icon: string): string {
   return icon && checkIconExists(icon) ? icon : "";
}

export function matchWithApps(app: Apps.Application, icon: string): boolean {
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

export function curateIcon(icon: string): string {
   let curatedIcon = searchIcon(icon);

   if (curatedIcon) {
      return curatedIcon;
   }

   const apps = new Apps.Apps();
   const foundedApp = apps.list.find((app) => matchWithApps(app, icon));

   curatedIcon =
      searchIcon(foundedApp?.get_icon_name() || "") ||
      searchIcon(icon) ||
      searchIcon(icon + "-symbolic");

   while (!curatedIcon) {
      const substitute = substitutes[icon];

      if (!substitute) {
         break;
      }

      icon = substitute;
      curatedIcon = searchIcon(icon);
   }

   return curatedIcon || "";
}
