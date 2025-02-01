export type Icon = {
   normal: string;
   symbolic: string;
};

export function createIcon(normal?: string, symbolic?: string): Icon {
   return {
      normal: normal ?? "",
      symbolic: symbolic ?? (normal ? `${normal}-symbolic` : ""),
   };
}

export default {
   missing: createIcon("image-missing"),
   broken: createIcon("package-broken"),

   fallback: {
      executable: createIcon("application-x-executable"),
      notification: createIcon("dialog-information"),
      video: createIcon("video-x-generic"),
      audio: createIcon("audio-x-generic"),
   },

   ui: {
      close: createIcon("window-close"),
      colorpicker: createIcon("color-select"),
      info: createIcon("info"),
      link: createIcon("external-link"),
      lock: createIcon("system-lock-screen"),
      menu: createIcon("open-menu"),
      refresh: createIcon("view-refresh"),
      search: createIcon("system-search"),
      settings: createIcon("emblem-system"),
      themes: createIcon("preferences-desktop-theme"),
      tick: createIcon("object-select"),
      time: createIcon("hourglass"),
      toolbars: createIcon("toolbars"),
      warning: createIcon("dialog-warning"),
      avatar: createIcon("avatar-default"),

      arrow: {
         right: createIcon("pan-end"),
         left: createIcon("pan-start"),
         down: createIcon("pan-down"),
         up: createIcon("pan-up"),
      },
   },

   audio: {
      mic: {
         muted: createIcon("microphone-disabled"),
         low: createIcon("microphone-sensitivity-low"),
         medium: createIcon("microphone-sensitivity-medium"),
         high: createIcon("microphone-sensitivity-high"),
      },

      volume: {
         muted: createIcon("audio-volume-muted"),
         low: createIcon("audio-volume-low"),
         medium: createIcon("audio-volume-medium"),
         high: createIcon("audio-volume-high"),
         overamplified: createIcon("audio-volume-overamplified"),
      },

      type: {
         headset: createIcon("audio-headphones"),
         speaker: createIcon("audio-speakers"),
         card: createIcon("audio-card"),
      },

      mixer: createIcon("mixer"),
   },

   powerprofile: {
      balanced: createIcon("power-profile-balanced"),
      powerSaver: createIcon("power-profile-power-saver"),
      performance: createIcon("power-profile-performance"),
   },

   battery: {
      default: createIcon("battery"),
      at000: createIcon("battery-000"),
      at010: createIcon("battery-010"),
      at020: createIcon("battery-020"),
      at030: createIcon("battery-030"),
      at040: createIcon("battery-040"),
      at050: createIcon("battery-050"),
      at060: createIcon("battery-060"),
      at070: createIcon("battery-070"),
      at080: createIcon("battery-080"),
      at090: createIcon("battery-090"),
      at100: createIcon("battery-100"),

      charging: {
         default: createIcon("battery-good-charging"),
         at000: createIcon("battery-000-charging"),
         at010: createIcon("battery-010-charging"),
         at020: createIcon("battery-020-charging"),
         at030: createIcon("battery-030-charging"),
         at040: createIcon("battery-040-charging"),
         at050: createIcon("battery-050-charging"),
         at060: createIcon("battery-060-charging"),
         at070: createIcon("battery-070-charging"),
         at080: createIcon("battery-080-charging"),
         at090: createIcon("battery-090-charging"),
         at100: createIcon("battery-100-charging"),
      },

      warning: createIcon("battery-empty"),
   },

   bluetooth: {
      enabled: createIcon("bluetooth-active"),
      disabled: createIcon("bluetooth-disabled"),
   },

   brightness: {
      indicator: createIcon("display-brightness"),
      keyboard: createIcon("keyboard-brightness"),
      screen: createIcon("display-brightness"),
   },

   powermenu: {
      sleep: createIcon("system-suspend"),
      reboot: createIcon("system-reboot"),
      logout: createIcon("system-log-out"),
      shutdown: createIcon("system-shutdown"),
   },

   recorder: {
      recording: createIcon("media-record"),
      screencast: createIcon("com.github.artemanufrij.screencast"),
   },

   notifications: {
      normal: createIcon("notifications"),
      noisy: createIcon("notification-active"),
      silent: createIcon("notifications-disabled"),
      message: createIcon("chat-bubbles"),
   },

   trash: {
      full: createIcon("user-trash-full"),
      empty: createIcon("user-trash"),
   },

   mpris: {
      shuffle: {
         enabled: createIcon("media-playlist-shuffle"),
         disabled: createIcon("media-playlist-consecutive"),
      },

      loop: {
         none: createIcon("media-playlist-repeat"),
         track: createIcon("media-playlist-repeat-song"),
         playlist: createIcon("media-playlist-repeat"),
      },

      playing: createIcon("media-playback-pause"),
      paused: createIcon("media-playback-start"),
      stopped: createIcon("media-playback-start"),
      prev: createIcon("media-skip-backward"),
      next: createIcon("media-skip-forward"),
   },

   system: {
      cpu: createIcon("cpu"),
      ram: createIcon("memory"),
      temp: createIcon("temperature"),
   },

   color: {
      dark: createIcon("dark-mode"),
      light: createIcon("light-mode"),
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
