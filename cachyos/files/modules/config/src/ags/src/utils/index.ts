import { substitutes } from "../icons";
import GLib from "gi://GLib";
import Apps from "gi://AstalApps";
import { readFileAsync } from "astal";
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
   if (!icon) {
      return "";
   }

   if (isValidImage(icon)) {
      return icon;
   }

   if (icon.endsWith("-symbolic")) {
      const modifiedIcon = icon.slice(0, -"-symbolic".length);
      if (modifiedIcon) return modifiedIcon;
   } else {
      if (isValidImage(icon + "-symbolic")) {
         return icon + "-symbolic";
      }
   }

   const apps = new Apps.Apps();
   const foundedApp = apps.list.find((app) => hasIconInApps(icon, app));

   if (foundedApp) {
      if (isValidImage(foundedApp.iconName)) {
         return foundedApp.iconName;
      }

      if (isValidImage(foundedApp + "symbolic")) {
         return foundedApp + "symbolic";
      }
   }

   const substitute = substitutes[icon];

   if (!substitute) {
      return "";
   }

   if (isValidImage(substitute)) {
      return substitute;
   }

   if (isValidImage(substitute + "symbolic")) {
      return substitute + "symbolic";
   }

   return "";
}

export type MemoryStats = {
   total: number;
   available: number;
   usage: number;
};

export async function getMemoryStats(): Promise<MemoryStats | null> {
   const meminfo = await readFileAsync("/proc/meminfo");
   let total = null;
   let available = null;

   for (const line of meminfo.split("\n")) {
      if (!line) continue;

      if (total && available) {
         // We have everything, break early
         break;
      }

      let [label, rest] = line.split(":");
      if (!rest) continue;
      rest = rest.trim();

      if (!rest.endsWith("kB")) {
         return null;
      }

      rest = rest.slice(0, -3);
      const amount = parseInt(rest, 10);
      if (isNaN(amount)) continue;

      if (label === "MemTotal") {
         total = amount;
      } else if (label === "MemAvailable") {
         available = amount;
      }
   }

   if (total === null || available === null) {
      return null;
   }

   return {
      total,
      available,
      usage: 1 - available / total,
   };
}

export type CpuStats = {
   total: number;
   idle: number;
};

export async function getCpuStats(): Promise<CpuStats | null> {
   const statFile = await readFileAsync("/proc/stat");
   if (!statFile.startsWith("cpu ")) return null;

   const cpuLine = statFile.slice(4, statFile.indexOf("\n")).trim();
   const stats = cpuLine.split(" ").map((part) => parseInt(part));

   const idle = stats[3] + stats[4];
   const total = stats.reduce((subtotal, curr) => subtotal + curr, 0);

   return {
      total: total,
      idle: idle,
   };
}
