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
      console.log("exists");
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

export function printError(msg: string) {
   console.log(msg);
}

export function curateIcon(icon: string): string {
   const apps = new Apps.Apps();

   const foundedApp = apps.list.find((app) => {
      // this fields can be null despite lsp saying otherwise
      const name = app.get_name();
      const entry = app.get_entry();
      const executable = app.get_executable();
      const description = app.get_description();

      if (!name) {
         return false;
      }

      if (name.toLowerCase().includes(icon.toLowerCase())) {
         return true;
      }

      if (icon.toLowerCase().includes(name.toLowerCase())) {
         return true;
      }

      if (!entry) {
         return false;
      }

      if (entry.toLowerCase().includes(icon)) {
         return true;
      }

      if (icon.toLowerCase().includes(entry.toLowerCase())) {
         return true;
      }

      if (!executable) {
         return false;
      }

      if (executable.toLowerCase().includes(icon)) {
         return true;
      }

      if (icon.toLowerCase().includes(executable)) {
         return true;
      }

      if (!description) {
         return false;
      }

      if (description.toLowerCase().includes(icon)) {
         return true;
      }

      if (icon.toLowerCase().includes(description.toLowerCase())) {
         return true;
      }

      return false;
   });

   let iconCurated = searchIcon(foundedApp?.get_icon_name());

   if (iconCurated === "") {
      iconCurated = searchIcon(icon);
   }

   if (iconCurated === "") {
      iconCurated = searchIcon(icon + "-symbolic");
   }

   return iconCurated;
}
