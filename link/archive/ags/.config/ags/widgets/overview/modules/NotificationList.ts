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
      className: "notification-popup-icon",
      vpack: "start",
      child: NotificationIcon(notification),
   });

   const title = Widget.Label({
      className: "notification-popup-title",
      hexpand: true,
      xalign: 0,
      justification: "left",
      truncate: "end",
      wrap: true,
      useMarkup: true,
      label: notification.summary,
   });

   const body = Widget.Label({
      className: "notification-popup-body",
      hexpand: true,
      xalign: 0,
      justification: "left",
      wrap: true,
      useMarkup: true,
      truncate: "end",
      label: notification.body,
   });

   const actions = Widget.Box({
      className: "notification-popup-actions",

      children: notification.actions.map(({ id, label }) =>
         Widget.Button({
            className: "notification-popup-action-button",

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
      className: `notification-popup ${notification.urgency}`,
      attribute: { id: notification.id },
      onPrimaryClick: notification.close,

      child: Widget.Box({
         vertical: true,
         children: [content, actions],
      }),
   });
};

export default () => {
   const notificationListArea = Widget.Box({
      className: "overview-notification-list-area",
      hexpand: true,
      vertical: true,
      spacing: 8,
      /* need this otherwise it won't bother rendering*/
      css: "min-width: 2px; min-height: 2px;",
      children: notificationsService.notifications.map(NotificationRow),

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
   });

   const scroll = Widget.Scrollable({
      hscroll: "never",
      vscroll: "always",

      child: notificationListArea,
   });

   const actionsContainer = Widget.Box({
      className: "overview-notification-list-actions-container",
      hexpand: true,
      css: "min-height: 2px; min-width: 2px;",

      children: [
         Widget.Button({
            hexpand: true,
            child: Widget.Label({
               label: "Clear All",
            }),

            onClicked: () => {
               notificationsService.clear();
            },
         }),
      ],
   });

   const scrollContainer = Widget.Box({
      hexpand: true,
      vexpand: true,
      child: scroll,
   });

   return Widget.Box({
      className: "overview-notification-list-container",
      vertical: true,

      children: [scrollContainer, actionsContainer],
   });
};
