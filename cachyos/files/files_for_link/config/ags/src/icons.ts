export default {
   missing: "image-missing",
   broken: "package-broken",

   fallback: {
      executable: "application-x-executable",
      notification: "dialog-information",
      video: "video-x-generic",
      audio: "audio-x-generic",
   },

   ui: {
      close: "window-close",
      colorpicker: "color-select",
      info: "info",
      link: "external-link",
      lock: "system-lock-screen",
      menu: "open-menu",
      refresh: "view-refresh",
      search: "system-search",
      settings: "emblem-system",
      themes: "preferences-desktop-theme",
      tick: "object-select",
      time: "hourglass",
      toolbars: "toolbars",
      warning: "dialog-warning",
      avatar: "avatar-default",

      arrow: {
         right: "pan-end",
         left: "pan-start",
         down: "pan-down",
         up: "pan-up",
      },
   },

   audio: {
      mic: {
         muted: "microphone-disabled",
         low: "microphone-sensitivity-low",
         medium: "microphone-sensitivity-medium",
         high: "microphone-sensitivity-high",
      },

      volume: {
         muted: "audio-volume-muted",
         low: "audio-volume-low",
         medium: "audio-volume-medium",
         high: "audio-volume-high",
         overamplified: "audio-volume-overamplified",
      },

      type: {
         headset: "audio-headphones",
         speaker: "audio-speakers",
         card: "audio-card",
      },

      mixer: "mixer",
   },

   powerprofile: {
      balanced: "power-profile-balanced",
      powerSaver: "power-profile-power-saver",
      performance: "power-profile-performance",
   },

   battery: {
      default: "battery",
      at000: "battery-000",
      at010: "battery-010",
      at020: "battery-020",
      at030: "battery-030",
      at040: "battery-040",
      at050: "battery-050",
      at060: "battery-060",
      at070: "battery-070",
      at080: "battery-080",
      at090: "battery-090",
      at100: "battery-100",

      charging: {
         default: "battery-good-charging",
         at000: "battery-000-charging",
         at010: "battery-010-charging",
         at020: "battery-020-charging",
         at030: "battery-030-charging",
         at040: "battery-040-charging",
         at050: "battery-050-charging",
         at060: "battery-060-charging",
         at070: "battery-070-charging",
         at080: "battery-080-charging",
         at090: "battery-090-charging",
         at100: "battery-100-charging",
      },

      warning: "battery-empty",
   },

   bluetooth: {
      enabled: "bluetooth-active",
      disabled: "bluetooth-disabled",
   },

   brightness: {
      indicator: "display-brightness",
      keyboard: "keyboard-brightness",
      screen: "display-brightness",
   },

   powermenu: {
      sleep: "system-suspend",
      reboot: "system-reboot",
      logout: "system-log-out",
      shutdown: "system-shutdown",
   },

   recorder: {
      recording: "media-record",
      screencast: "com.github.artemanufrij.screencast",
   },

   notifications: {
      normal: "notifications",
      noisy: "notification-active",
      silent: "notifications-disabled",
      message: "chat-bubbles",
   },

   trash: {
      full: "user-trash-full",
      empty: "user-trash",
   },

   mpris: {
      shuffle: {
         enabled: "media-playlist-shuffle",
         disabled: "media-playlist-consecutive",
      },

      loop: {
         none: "media-playlist-repeat",
         track: "media-playlist-repeat-song",
         playlist: "media-playlist-repeat",
      },

      playing: "media-playback-pause",
      paused: "media-playback-start",
      stopped: "media-playback-start",
      prev: "media-skip-backward",
      next: "media-skip-forward",
   },

   system: {
      cpu: "cpu",
      ram: "memory",
      temp: "temperature",
   },

   color: {
      dark: "dark-mode",
      light: "light-mode",
   },
};

export const substitutes: { [key: string]: string } = {
   "transmission-gtk": "transmission",
   "blueberry.py": "blueberry",
   "com.raggesilver.BlackBox": "terminal",
   "org.wezfurlong.wezterm": "terminal",
   "audio-headset-bluetooth": "audio-headphones",
   "audio-card-analog-usb": "audio-speakers",
   "audio-card-analog-pci": "audio-card",
   "preferences-system": "emblem-system",
   "jetbrains-studio": "android-studio",
};
