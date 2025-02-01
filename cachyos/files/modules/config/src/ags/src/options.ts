export default {
   theme: {
      icons: "candy-icons",
   },

   bar: {
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
      symbolic: {
         notification: {
            appIcon: true,
            close: true,
         },
      },
   },

   notificationsPopup: {
      timeout: 5000,
      maxItems: 5,
   },

   appLauncher: {
      maxItems: 5,
   },

   filler: {
      width: 4000,
      height: 4000,
   },
};
