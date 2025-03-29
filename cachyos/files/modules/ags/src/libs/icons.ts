export interface Icon {
   normal: string;
   symbolic: string;
}

export interface CreateIconProps {
   normal?: string;
   symbolic?: string;
}

export function createIcon(props: CreateIconProps): Icon {
   const { normal, symbolic } = props;
   const _normal = normal ?? "";
   const _symbolic = symbolic ?? (_normal !== "" ? `${_normal}-symbolic` : "");

   return {
      normal: _normal,
      symbolic: _symbolic,
   };
}

export default {
   missing: createIcon({ normal: "image-missing" }),
   broken: createIcon({ normal: "package-broken" }),

   fallback: {
      executable: createIcon({ normal: "application-x-executable" }),
      notification: createIcon({ normal: "dialog-information" }),
      video: createIcon({ normal: "video-x-generic" }),
      audio: createIcon({ normal: "audio-x-generic" }),
   },

   ui: {
      close: createIcon({ normal: "window-close" }),
      colorpicker: createIcon({ normal: "color-select" }),
      info: createIcon({ normal: "info" }),
      link: createIcon({ normal: "external-link" }),
      lock: createIcon({ normal: "system-lock-screen" }),
      menu: createIcon({ normal: "open-menu" }),
      refresh: createIcon({ normal: "view-refresh" }),
      search: createIcon({ normal: "system-search" }),
      settings: createIcon({ normal: "emblem-system" }),
      themes: createIcon({ normal: "preferences-desktop-theme" }),
      tick: createIcon({ normal: "object-select" }),
      time: createIcon({ normal: "hourglass" }),
      toolbars: createIcon({ normal: "toolbars" }),
      warning: createIcon({ normal: "dialog-warning" }),
      avatar: createIcon({ normal: "avatar-default" }),

      arrow: {
         right: createIcon({ normal: "pan-end" }),
         left: createIcon({ normal: "pan-start" }),
         down: createIcon({ normal: "pan-down" }),
         up: createIcon({ normal: "pan-up" }),
      },
   },

   audio: {
      mic: {
         muted: createIcon({ normal: "microphone-disabled" }),
         low: createIcon({ normal: "microphone-sensitivity-low" }),
         medium: createIcon({ normal: "microphone-sensitivity-medium" }),
         high: createIcon({ normal: "microphone-sensitivity-high" }),
      },

      volume: {
         muted: createIcon({ normal: "audio-volume-muted" }),
         low: createIcon({ normal: "audio-volume-low" }),
         medium: createIcon({ normal: "audio-volume-medium" }),
         high: createIcon({ normal: "audio-volume-high" }),
         overamplified: createIcon({ normal: "audio-volume-overamplified" }),
      },

      type: {
         headset: createIcon({ normal: "audio-headphones" }),
         speaker: createIcon({ normal: "audio-speakers" }),
         card: createIcon({ normal: "audio-card" }),
      },

      mixer: createIcon({ normal: "mixer" }),
   },

   powerprofile: {
      balanced: createIcon({ normal: "power-profile-balanced" }),
      powerSaver: createIcon({ normal: "power-profile-power-saver" }),
      performance: createIcon({ normal: "power-profile-performance" }),
   },

   battery: {
      default: createIcon({ normal: "battery" }),
      at000: createIcon({ normal: "battery-000" }),
      at010: createIcon({ normal: "battery-010" }),
      at020: createIcon({ normal: "battery-020" }),
      at030: createIcon({ normal: "battery-030" }),
      at040: createIcon({ normal: "battery-040" }),
      at050: createIcon({ normal: "battery-050" }),
      at060: createIcon({ normal: "battery-060" }),
      at070: createIcon({ normal: "battery-070" }),
      at080: createIcon({ normal: "battery-080" }),
      at090: createIcon({ normal: "battery-090" }),
      at100: createIcon({ normal: "battery-100" }),

      charging: {
         default: createIcon({ normal: "battery-good-charging" }),
         at000: createIcon({ normal: "battery-000-charging" }),
         at010: createIcon({ normal: "battery-010-charging" }),
         at020: createIcon({ normal: "battery-020-charging" }),
         at030: createIcon({ normal: "battery-030-charging" }),
         at040: createIcon({ normal: "battery-040-charging" }),
         at050: createIcon({ normal: "battery-050-charging" }),
         at060: createIcon({ normal: "battery-060-charging" }),
         at070: createIcon({ normal: "battery-070-charging" }),
         at080: createIcon({ normal: "battery-080-charging" }),
         at090: createIcon({ normal: "battery-090-charging" }),
         at100: createIcon({ normal: "battery-100-charging" }),
      },

      warning: createIcon({ normal: "battery-empty" }),
   },

   bluetooth: {
      enabled: createIcon({ normal: "bluetooth-active" }),
      disabled: createIcon({ normal: "bluetooth-disabled" }),
   },

   brightness: {
      indicator: createIcon({ normal: "display-brightness" }),
      keyboard: createIcon({ normal: "keyboard-brightness" }),
      screen: createIcon({ normal: "display-brightness" }),
   },

   powermenu: {
      sleep: createIcon({ normal: "system-suspend" }),
      reboot: createIcon({ normal: "system-reboot" }),
      logout: createIcon({ normal: "system-log-out" }),
      shutdown: createIcon({ normal: "system-shutdown" }),
   },

   recorder: {
      recording: createIcon({ normal: "media-record" }),
      screencast: createIcon({ normal: "com.github.artemanufrij.screencast" }),
   },

   notifications: {
      normal: createIcon({ normal: "notifications" }),
      noisy: createIcon({ normal: "notification-active" }),
      silent: createIcon({ normal: "notifications-disabled" }),
      message: createIcon({ normal: "chat-bubbles" }),
   },

   trash: {
      full: createIcon({ normal: "user-trash-full" }),
      empty: createIcon({ normal: "user-trash" }),
   },

   mpris: {
      shuffle: {
         enabled: createIcon({ normal: "media-playlist-shuffle" }),
         disabled: createIcon({ normal: "media-playlist-consecutive" }),
      },

      loop: {
         none: createIcon({ normal: "media-playlist-repeat" }),
         track: createIcon({ normal: "media-playlist-repeat-song" }),
         playlist: createIcon({ normal: "media-playlist-repeat" }),
      },

      playing: createIcon({ normal: "media-playback-pause" }),
      paused: createIcon({ normal: "media-playback-start" }),
      stopped: createIcon({ normal: "media-playback-start" }),
      prev: createIcon({ normal: "media-skip-backward" }),
      next: createIcon({ normal: "media-skip-forward" }),
   },

   system: {
      cpu: createIcon({ normal: "cpu" }),
      ram: createIcon({ normal: "memory" }),
      temp: createIcon({ normal: "temperature" }),
   },

   color: {
      dark: createIcon({ normal: "dark-mode" }),
      light: createIcon({ normal: "light-mode" }),
   },
};
