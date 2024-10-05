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
            bg: opt("#f44747"),
            fg: opt("#000000"),
         },
         bg: opt("#1E2127"),
         fg: opt("#abb2bf"),
         widget: opt("#282C34"),
         border: opt("#5B626F"),
         alert: opt("#d19a66"),
      },
      light: {
         primary: {
            bg: opt("#315EEE"),
            fg: opt("#8E8F96"),
         },
         error: {
            bg: opt("#DA3E39"),
            fg: opt("#8E8F96"),
         },
         bg: opt("#F8F8F8"),
         fg: opt("#2A2B32"),
         widget: opt("#FFFEFE"),
         border: opt("#080808"),
         alert: opt("#855504"),
      },

      blur: opt(0),
      scheme: opt<"dark" | "light">("dark"),
      widget: { opacity: opt(0) },
      border: {
         innerWidth: opt(0),
         outerWidth: opt(3),
         opacity: opt(0),
      },

      shadows: opt(true),
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
      cornersCurve: opt(0),
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

      screenCorners: {
         color: opt("#5B626F"),
         width: opt(1),
         opacity: opt(100)
      },

      launcher: {
         icon: {
            colored: opt(true),
            icon: opt(icon(distro.logo, icons.ui.search)),
         },
         label: {
            colored: opt(false),
            label: opt(""),
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
         charactersToStrip: opt("「」『』☯︎"),
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
