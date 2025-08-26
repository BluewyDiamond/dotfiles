import GLib from "gi://GLib";

const configPath = GLib.get_user_config_dir();
const configPathName = `${configPath}/bluewy-shell/config.js`;
const config = (await import(`file://${configPathName}`)) as object;

function deepMerge<T>(defaultObj: T, overrideObj: Partial<T>): T {
   const result: any = { ...defaultObj };

   for (const key in overrideObj) {
      if (
         overrideObj[key] !== null &&
         typeof overrideObj[key] === "object" &&
         !Array.isArray(overrideObj[key])
      ) {
         result[key] = deepMerge(
            (defaultObj as any)[key] || {},
            overrideObj[key] as any
         );
      } else if (overrideObj[key] !== undefined) {
         result[key] = overrideObj[key];
      }
   }

   return result;
}

export const defaultConfig = {
   theme: {
      primary: "",
      onPrimary: "",
      primaryContainer: "",
      onPrimaryContainer: "",
   },

   bar: {
      layout: {
         start: [""],
         center: [""],
         end: [""],
      },

      hyprlandStaticWorkspaces: {},
      hyprlandTaskBar: {},
      niriStaticWorkspaces: {},
      niriTaskBar: {},
      dateTime: {},
      tray: {},
      indicators: {},
   },

   notificationToast: {},
   controlCenter: {},
};

export const mergedConfig = deepMerge(defaultConfig, config);
