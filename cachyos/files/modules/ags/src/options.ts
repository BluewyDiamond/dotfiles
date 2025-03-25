export default {
   general: {
      icons: "candy-icons",
      monochrome: false,
      rapidTimeout: 100,

      sh: {
         cmd: ["fish", "-c"],
      },

      filler: {
         width: 4000,
         height: 4000,
      },
   },

   bar: {
      name: "astal_bar",

      workspaces: {
         values: [1, 2, 3, 4, 8, 9, 10],
      },

      indicators: {
         powerprofiles: {
            monochrome: true,
         },
      },
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
};
