export default {
   general: {
      icons: "candy-icons",
      rapidTimeout: 100,
      fallbackLabel: "⚠",
      maxChars: 30,

      sh: {
         cmd: ["fish", "-c"],
      },
   },

   bar: {
      name: "astal_bar",

      workspaces: {
         values: [1, 2, 3, 4, 8, 9, 10],
      },
   },

   notificationsPopup: {
      name: "astal_notifications_popup",
      timeout: 5000,
      maxItems: 5,
      maxChars: 30,
   },

   appLauncher: {
      name: "astal_app_launcher",
      maxItems: 5,
      maxChars: 45,
   },

   controlCenter: {
      name: "control_center",
   },
};
