export default {
   missing: "image-missing-symbolic",
   broken: "package-broken",

   app: {
      terminal: "terminal-symbolic",
   },

   fallback: {
      executable: "application-x-executable",
      notification: "dialog-information-symbolic",
      video: "video-x-generic-symbolic",
      audio: "audio-x-generic-symbolic",
   },

   ui: {
      close: "window-close-symbolic",
      colorpicker: "color-select-symbolic",
      info: "info-symbolic",
      link: "external-link-symbolic",
      lock: "system-lock-screen-symbolic",
      menu: "open-menu-symbolic",
      refresh: "view-refresh-symbolic",
      search: "system-search-symbolic",
      settings: "emblem-system-symbolic",
      themes: "preferences-desktop-theme-symbolic",
      tick: "object-select-symbolic",
      time: "hourglass-symbolic",
      toolbars: "toolbars-symbolic",
      warning: "dialog-warning-symbolic",
      avatar: "avatar-default-symbolic",

      arrow: {
         right: "pan-end-symbolic",
         left: "pan-start-symbolic",
         down: "pan-down-symbolic",
         up: "pan-up-symbolic",
      },
   },

   audio: {
      mic: {
         muted: "microphone-disabled-symbolic",
         low: "microphone-sensitivity-low-symbolic",
         medium: "microphone-sensitivity-medium-symbolic",
         high: "microphone-sensitivity-high-symbolic",
      },

      volume: {
         muted: "audio-volume-muted-symbolic",
         low: "audio-volume-low-symbolic",
         medium: "audio-volume-medium-symbolic",
         high: "audio-volume-high-symbolic",
         overamplified: "audio-volume-overamplified-symbolic",
      },

      type: {
         headset: "audio-headphones-symbolic",
         speaker: "audio-speakers-symbolic",
         card: "audio-card-symbolic",
      },

      mixer: "mixer-symbolic",
   },

   powerprofile: {
      balanced: "power-profile-balanced-symbolic",
      powerSaver: "power-profile-power-saver-symbolic",
      performance: "power-profile-performance-symbolic",
   },

   battery: {
      default: "battery-symbolic",
      at000: "battery-000-symbolic",
      at010: "battery-010-symbolic",
      at020: "battery-020-symbolic",
      at030: "battery-030-symbolic",
      at040: "battery-040-symbolic",
      at050: "battery-050-symbolic",
      at060: "battery-060-symbolic",
      at070: "battery-070-symbolic",
      at080: "battery-080-symbolic",
      at090: "battery-090-symbolic",
      at100: "battery-100-symbolic",

      charging: {
         default: "battery-good-charging-symbolic",
         at000: "battery-000-charging-symbolic",
         at010: "battery-010-charging-symbolic",
         at020: "battery-020-charging-symbolic",
         at030: "battery-030-charging-symbolic",
         at040: "battery-040-charging-symbolic",
         at050: "battery-050-charging-symbolic",
         at060: "battery-060-charging-symbolic",
         at070: "battery-070-charging-symbolic",
         at080: "battery-080-charging-symbolic",
         at090: "battery-090-charging-symbolic",
         at100: "battery-100-charging-symbolic",
      },

      warning: "battery-empty-symbolic",
   },

   bluetooth: {
      enabled: "bluetooth-active-symbolic",
      disabled: "bluetooth-disabled-symbolic",
   },

   brightness: {
      indicator: "display-brightness-symbolic",
      keyboard: "keyboard-brightness-symbolic",
      screen: "display-brightness-symbolic",
   },

   powermenu: {
      sleep: "system-suspend-symbolic",
      reboot: "system-reboot-symbolic",
      logout: "system-log-out-symbolic",
      shutdown: "system-shutdown-symbolic",
   },

   recorder: {
      recording: "media-record-symbolic",
      screencast: "com.github.artemanufrij.screencast",
   },

   notifications: {
      normal: "notifications",
      noisy: "notification-active",
      silent: "notifications-disabled-symbolic",
      message: "chat-bubbles-symbolic",
   },

   trash: {
      full: "user-trash-full-symbolic",
      empty: "user-trash-symbolic",
   },

   mpris: {
      shuffle: {
         enabled: "media-playlist-shuffle-symbolic",
         disabled: "media-playlist-consecutive-symbolic",
      },

      loop: {
         none: "media-playlist-repeat-symbolic",
         track: "media-playlist-repeat-song-symbolic",
         playlist: "media-playlist-repeat-symbolic",
      },

      playing: "media-playback-pause-symbolic",
      paused: "media-playback-start-symbolic",
      stopped: "media-playback-start-symbolic",
      prev: "media-skip-backward-symbolic",
      next: "media-skip-forward-symbolic",
   },

   system: {
      cpu: "org.gnome.SystemMonitor-symbolic",
      ram: "drive-harddisk-solidstate-symbolic",
      temp: "temperature-symbolic",
   },

   color: {
      dark: "dark-mode-symbolic",
      light: "light-mode-symbolic",
   },
};

export const substitutes: { [key: string]: string } = {
   "transmission-gtk": "transmission",
   "blueberry.py": "blueberry",
   "com.raggesilver.BlackBox-symbolic": "terminal-symbolic",
   "org.wezfurlong.wezterm-symbolic": "terminal-symbolic",
   "audio-headset-bluetooth": "audio-headphones-symbolic",
   "audio-card-analog-usb": "audio-speakers-symbolic",
   "audio-card-analog-pci": "audio-card-symbolic",
   "preferences-system": "emblem-system-symbolic",
   "com.github.Aylur.ags-symbolic": "controls-symbolic",
   "com.github.Aylur.ags": "controls-symbolic",
   "jetbrains-studio": "android-studio",
};
