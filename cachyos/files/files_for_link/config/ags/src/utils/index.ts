import icons, { substitutes } from "../libs/icons";
import { Gtk } from "astal/gtk3";
import GLib from "gi://GLib";
import Apps from "gi://AstalApps";

export function searchIcon(name: string | null | undefined): string {
   if (!name) {
      return "";
   }

   const icon = substitutes[name] || name;

   if (GLib.file_test(icon, GLib.FileTest.EXISTS)) {
      return icon;
   } else {
      if (
         Gtk.IconTheme.get_default().lookup_icon(
            icon,
            16,
            Gtk.IconLookupFlags.USE_BUILTIN
         )
      ) {
         return icon;
      } else {
         return "";
      }
   }
}

export function curateIcon(icon: string): string {
   const apps = new Apps.Apps();
   const iconInLowerCase = icon.toLowerCase();

   function matchesIcon(app: Apps.Application): boolean {
      const name = app.get_name()?.toLowerCase();
      const entry = app.get_entry()?.toLowerCase();
      const executable = app.get_executable()?.toLowerCase();
      const description = app.get_description()?.toLowerCase();

      if (
         name &&
         (name.includes(iconInLowerCase) || iconInLowerCase.includes(name))
      )
         return true;

      if (
         entry &&
         (entry.includes(iconInLowerCase) || iconInLowerCase.includes(entry))
      )
         return true;

      if (
         executable &&
         (executable.includes(iconInLowerCase) ||
            iconInLowerCase.includes(executable))
      )
         return true;

      if (
         description &&
         (description.includes(iconInLowerCase) ||
            iconInLowerCase.includes(description))
      )
         return true;

      return false;
   }

   const foundedApp = apps.list.find(matchesIcon);

   let iconCurated = searchIcon(foundedApp?.get_icon_name() || "");
   if (!iconCurated) iconCurated = searchIcon(icon);
   if (!iconCurated) iconCurated = searchIcon(icon + "-symbolic");

   return iconCurated;
}
