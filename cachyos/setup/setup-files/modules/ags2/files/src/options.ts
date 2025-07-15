import icons from "./icons";

export default {
   hyprland: {
      workspaces: { ids: [1, 2, 3, 4, 8, 9, 10], flat: false },
   },

   indicators: {
      powerprofile: {
         powerSaverIcon: icons.powerprofile.powerSaver,
         balancedIcon: icons.powerprofile.balanced,
         performanceIcon: icons.powerprofile.performance,
      },

      microphoneIcon: "",
      screenshareIcon: "",
      speakerIcon: "",
      notificationIcon: "",
   },

   notificationToasts: {
      timeout: 5000,

      notification: {
         closeIcon: icons.ui.close,
      },
   },
};
