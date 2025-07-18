import icons from "./lib/icons";

export default {
   bar: {
      workspaces: { ids: [1, 2, 3, 4, 8, 9, 10] },

      taskbar: {
         flat: false,
      },

      indicators: {
         powerprofile: {
            icons: {
               powerSaver: icons.powerprofile.powerSaver,
               balanced: icons.powerprofile.balanced,
               performance: icons.powerprofile.performance,
            },
         },

         microphoneRecorders: {
            icons: {
               microphoneLow: icons.audio.mic.low,
               microphoneMedium: icons.audio.mic.medium,
               microphoneHigh: icons.audio.mic.high,
               microphoneMuted: icons.audio.mic.muted,
            },
         },

         speaker: {
            icons: {
               speakerMuted: icons.audio.volume.muted,
               speakerLow: icons.audio.volume.low,
               speakerMedium: icons.audio.volume.medium,
               speakerHigh: icons.audio.volume.high,
               speakerOveramplified: icons.audio.volume.overamplified,
            },
         },

         icons: {
            screenshare: icons.recorder.screencast,
            notification: icons.notification.normal,
         },
      },

      notificationsIndicator: {
         icons: {
            notificationNormal: icons.notification.normal,
            notificationNoisy: icons.notification.noisy,
         },
      },
   },

   notificationToasts: {
      timeout: 5000,

      notification: {
         closeIcon: icons.ui.close,
         maximumSize: 400,
      },
   },
};
