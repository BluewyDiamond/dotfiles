import { Notification } from "types/service/notifications";

const notificationsService = await Service.import("notifications");

const NotificationIcon = ({ app_entry, app_icon, image }) => {
   if (image) {
      return Widget.Box({
         css:
            `background-image: url("${image}");` +
            "background-size: contain;" +
            "background-repeat: no-repeat;" +
            "background-position: center;",
      });
   }

   let icon = "dialog-information-symbolic";
   if (Utils.lookUpIcon(app_icon)) icon = app_icon;

   if (app_entry && Utils.lookUpIcon(app_entry)) icon = app_entry;

   return Widget.Box({
      child: Widget.Icon(icon),
   });
};

const NotificationRow = (notification: Notification) => {
   const icon = Widget.Box({
      vpack: "start",
      className: "icon",
      child: NotificationIcon(notification),
   });

   const title = Widget.Label({
      className: "title",
      xalign: 0,
      justification: "left",
      hexpand: true,
      max_width_chars: 24,
      truncate: "end",
      wrap: true,
      label: notification.summary,
      use_markup: true,
   });

   const body = Widget.Label({
      className: "body",
      hexpand: true,
      use_markup: true,
      xalign: 0,
      justification: "left",
      label: notification.body,
      wrap: true,
   });

   const actions = Widget.Box({
      className: "actions",

      children: notification.actions.map(({ id, label }) =>
         Widget.Button({
            className: "action-button",

            onClicked: () => {
               notification.invoke(id);
               notification.dismiss();
            },

            hexpand: true,
            child: Widget.Label(label),
         })
      ),
   });

   const group1 = Widget.Box({
      vertical: true,
      children: [title, body],
   });

   const content = Widget.Box({
      children: [icon, group1],
   });

   return Widget.Button({
      className: `notification ${notification.urgency}`,
      attribute: { id: notification.id },
      onPrimaryClick: notification.close,

      child: Widget.Box({
         vertical: true,
         children: [content, actions],
      }),
   });
};

export default () => {
   let notificationsList =
      notificationsService.notifications.map(NotificationRow);

   const notificationsContainer = Widget.Box({
      className: "notifications-container",

      child: Widget.Box({
         name: "overview",
         className: "notifications-area",
         /* need this otherwise it won't bother rendering*/
         css: "min-width: 2px; min-height: 2px;",
         vertical: true,
         children: notificationsList,

         setup: (self) =>
            self
               .hook(
                  notificationsService,
                  () => {
                     self.children =
                        notificationsService.notifications.map(NotificationRow);
                  },
                  "notified"
               )
               .hook(
                  notificationsService,
                  () => {
                     self.children =
                        notificationsService.notifications.map(NotificationRow);
                  },
                  "closed"
               ),
      }),
   });

   return notificationsContainer;
};
