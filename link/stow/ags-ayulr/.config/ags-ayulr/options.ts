import { opt, mkOptions } from "lib/option";
import { distro } from "lib/variables";
import { icon } from "lib/utils";
import icons from "lib/icons";

const options = mkOptions(OPTIONS, {
   autotheme: opt(false),

   theme: {
      dark: {
         primary: {
            bg: opt("#61AFEF"),
            fg: opt("#000000"),
         },
         error: {
            bg: opt("#E06C75"),
            fg: opt("#000000"),
         },
         bg: opt("#1E2127"),
         fg: opt("#abb2bf"),
         widget: opt("#F6F7F9"),
         border: opt("#5c6370"),
         alert: opt("#d19a66")
      },
      light: {
         primary: {
            bg: opt("#426ede"),
            fg: opt("#eeeeee"),
         },
         error: {
            bg: opt("#b13558"),
            fg: opt("#eeeeee"),
         },
         bg: opt("#fffffa"),
         fg: opt("#080808"),
         widget: opt("#080808"),
         border: opt("#080808"),
         alert: opt("#FF9F00")
      },

      blur: opt(0),
      scheme: opt<"dark" | "light">("dark"),
      widget: { opacity: opt(94) },
      border: {
         innerWidth: opt(1),
         outerWidth: opt(3),
         opacity: opt(0),
      },

      shadows: opt(false),
      padding: opt(7),
      spacing: opt(12),
      radius: opt(11),
   },

   transition: opt(200),

   font: {
      size: opt(14),
      name: opt("Iosevka Nerd Font"),
      weight: opt(500),
   },

   bar: {
      flatButtons: opt(false),
      position: opt<"top" | "bottom">("top"),
      cornersCurve: opt(11),
      transparent: opt(false),
      layout: {
         start: opt<Array<import("widget/bar/Bar").BarWidget>>([
            "launcher",
            "workspaces",
            "taskbar",
            "expander",
            "messages",
         ]),
         center: opt<Array<import("widget/bar/Bar").BarWidget>>(["date"]),
         end: opt<Array<import("widget/bar/Bar").BarWidget>>([
            "media",
            "expander",
            "systray",
            "colorpicker",
            "screenrecord",
            "system",
            "battery",
            "powermenu",
         ]),
      },
      launcher: {
         icon: {
            colored: opt(true),
            icon: opt(icon(distro.logo, icons.ui.search)),
         },
         label: {
            colored: opt(false),
            label: opt(" Applications"),
         },
         action: opt(() => App.toggleWindow("ags-launcher")),
      },
      date: {
         format: opt("%H:%M - %A %e."),
         action: opt(() => App.toggleWindow("ags-datemenu")),
      },
      battery: {
         bar: opt<"hidden" | "regular" | "whole">("regular"),
         charging: opt("#98C379"),
         percentage: opt(true),
         blocks: opt(7),
         width: opt(50),
         low: opt(30),
      },
      workspaces: {
         workspaces: opt(10),
         workspacesToIgnore: opt<Array<number>>([5, 6, 7]),
      },
      taskbar: {
         iconSize: opt(0),
         monochrome: opt(false),
         exclusive: opt(false),
      },
      messages: {
         action: opt(() => App.toggleWindow("ags-datemenu")),
      },
      systray: {
         ignore: opt(["KDE Connect Indicator", "spotify-client"]),
      },
      media: {
         monochrome: opt(false),
         preferred: opt("spotify"),
         direction: opt<"left" | "right">("right"),
         format: opt("{artists} - {title}"),
         length: opt(40),
         charactersToStrip: opt("「」『』"),
      },
      powermenu: {
         monochrome: opt(false),
         action: opt(() => App.toggleWindow("ags-powermenu")),
      },
   },

   launcher: {
      width: opt(0),
      margin: opt(80),
      nix: {
         pkgs: opt("nixpkgs/nixos-unstable"),
         max: opt(8),
      },
      sh: {
         max: opt(16),
      },
      apps: {
         iconSize: opt(62),
         max: opt(6),
         favorites: opt([
            [
               "firefox",
               "wezterm",
               "org.gnome.Nautilus",
               "org.gnome.Calendar",
               "spotify",
            ],
         ]),
      },
   },

   overview: {
      scale: opt(9),
      workspaces: opt(10),
      monochromeIcon: opt(false),
      workspacesToIgnore: opt<Array<number>>([5, 6, 7]),
   },

   powermenu: {
      sleep: opt("systemctl suspend"),
      reboot: opt("systemctl reboot"),
      logout: opt("pkill Hyprland"),
      shutdown: opt("shutdown now"),
      layout: opt<"line" | "box">("line"),
      labels: opt(true),
   },

   quicksettings: {
      avatar: {
         image: opt(`/var/lib/AccountsService/icons/${Utils.USER}`),
         size: opt(70),
      },
      width: opt(380),
      position: opt<"left" | "center" | "right">("right"),
      networkSettings: opt("gtk-launch gnome-control-center"),
      media: {
         monochromeIcon: opt(false),
         coverSize: opt(100),
      },
   },

   datemenu: {
      position: opt<"left" | "center" | "right">("center"),
      weather: {
         interval: opt(60_000),
         unit: opt<"metric" | "imperial" | "standard">("metric"),
         key: opt<string>(
            JSON.parse(Utils.readFile(`${App.configDir}/.weather`) || "{}")
               ?.key || ""
         ),
         cities: opt<Array<number>>(
            JSON.parse(Utils.readFile(`${App.configDir}/.weather`) || "{}")
               ?.cities || []
         ),
      },
   },

   osd: {
      progress: {
         vertical: opt(true),
         pack: {
            h: opt<"start" | "center" | "end">("end"),
            v: opt<"start" | "center" | "end">("center"),
         },
      },
      microphone: {
         pack: {
            h: opt<"start" | "center" | "end">("center"),
            v: opt<"start" | "center" | "end">("end"),
         },
      },
   },

   notifications: {
      position: opt<Array<"top" | "bottom" | "left" | "right">>([
         "top",
         "right",
      ]),
      blacklist: opt(["Spotify"]),
      width: opt(440),
   },
});

globalThis["options"] = options;
export default options;
