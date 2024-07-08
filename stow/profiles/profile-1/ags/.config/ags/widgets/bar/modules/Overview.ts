const notificationService = await Service.import("notifications");

export default () => {
   const label = Widget.Label({
      label: "+",
   });

   return Widget.Button({
      className: "notification-indicator",
      onClicked: () => {
         App.toggleWindow("ags-overview");
      },
      child: label,

      setup: (self) =>
         self
            .hook(
               notificationService,
               () => {
                  print("debug: " + notificationService.notifications.length);
                  self.child.toggleClassName(
                     "non-empty",
                     notificationService.notifications.length !== 0
                  );
               },
               "notified"
            )

            .hook(
               notificationService,
               () => {
                  print("debug2: " + notificationService.notifications.length);
                  self.child.toggleClassName(
                     "non-empty",
                     notificationService.notifications.length !== 0
                  );
               },
               "closed"
            ),
   });
};
