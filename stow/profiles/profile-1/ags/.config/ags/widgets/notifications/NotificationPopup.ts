import { Notification } from "resource:///com/github/Aylur/ags/service/notifications.js";

const notifications = await Service.import("notifications");

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
function NotificationIcon({ app_entry, app_icon, image }) {
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
}

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} notification */
function NotificationPopup(notification: Notification) {
   const icon = Widget.Box({
      vpack: "start",
      className: "notification-popup-icon",
      child: NotificationIcon(notification),
   });

   const title = Widget.Label({
      className: "notification-popup-title",
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
      className: "notification-popup-body",
      hexpand: true,
      use_markup: true,
      xalign: 0,
      justification: "left",
      label: notification.body,
      wrap: true,
   });

   const actions = Widget.Box({
      className: "notification-popup-actions",

      children: notification.actions.map(({ id, label }) =>
         Widget.Button({
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
      onPrimaryClick: notification.dismiss,

      child: Widget.Box({
         vertical: true,
         children: [content, actions],
      }),
   });
}

export default (monitor: number = 0) => {
   return Widget.Window({
      monitor,
      name: `ags-notification-popups-${monitor}`,
      anchor: ["top", "right"],
      margins: [8, 8, 8, 8],

      child: Widget.Box({
         vertical: true,
         children: notifications.popups.map(NotificationPopup),
         /* need this otherwise it won't bother rendering*/
         css: "min-width: 2px; min-height: 2px;",

         setup: (self) =>
            self
               .hook(
                  notifications,
                  (_, id: number) => {
                     const n = notifications.getNotification(id);
                     if (n)
                        self.children = [
                           NotificationPopup(n),
                           ...self.children,
                        ];
                  },
                  "notified"
               )
               .hook(
                  notifications,
                  (_, id: number) => {
                     self.children
                        .find((n) => n.attribute.id === id)
                        ?.destroy();
                  },
                  "dismissed"
               ),
      }),
   });
};
