import icons, { substitutes } from "./icons";
import GLib from "gi://GLib";

export function curateIcon(
  name: string | null,
  fallback = icons.missing
): string {
  if (!name) {
    if (GLib.file_test(fallback, GLib.FileTest.EXISTS)) {
      print(fallback);
      return fallback;
    }

    return "";
  }

  const substitue = substitutes[name] || name;

  if (GLib.file_test(substitue, GLib.FileTest.EXISTS)) {
    print("substitue");
    return substitue;
  }

  return name;
}

export function printError(msg: string) {
  console.log(msg);
}
