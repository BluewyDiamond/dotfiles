export default {
   theme: {
      icons: "candy-icons",
   },

   bar: {
      name: "astal_bar",

      workspaces: {
         values: [1, 2, 3, 4, 8, 9, 10],
      },

      indicators: {
         powerprofiles: {
            symbolic: true,
         },
      },
   },

   notificationsOverview: {
      name: "astal_notifications_overview",
   },

   notificationsPopup: {
      name: "astal_notifications_popup",
      timeout: 5000,
      maxItems: 5,
   },

   appLauncher: {
      name: "astal_app_launcher",
      maxItems: 5,

      refresh: {
         symbolic: true,
      },
   },

   controlCenter: {
      name: "control_center",

      actions: {
         rows: 2,
         columns: 2,
      },
   },

   notification: {
      closeIcon: {
         symbolic: true,
      },

      fallbackIcon: {
         symbolic: true,
      },
   },

   rapidTimeout: 100,

   sh: {
      cmd: ["fish", "-c"],
   },

   filler: {
      width: 4000,
      height: 4000,
   },
};
