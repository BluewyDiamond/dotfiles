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
function Notification2(notification: Notification) {
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
      children: [title, body]
   })

   const content = Widget.Box({
      children: [icon, group1]
   })

   return Widget.EventBox({
      className: "eventBox",
      attribute: { id: notification.id },
      onPrimaryClick: notification.dismiss,

      child: Widget.Box({
         className: `notification ${notification.urgency}`,
         vertical: true,
         children: [content, actions]
      })
   });
}

export default (monitor: number = 0) => {
   const list = Widget.Box({
      vertical: true,
      children: notifications.popups.map(Notification2),

      setup: (self) =>
         self
            .hook(notifications, (_, id: number) => {
               const n = notifications.getNotification(id);
               if (n) list.children = [Notification2(n), ...list.children];
            }, "notified")
            .hook(notifications, (_, id: number) => {
               list.children.find((n) => n.attribute.id === id)?.destroy();
            }, "dismissed")
   });

   return Widget.Window({
      monitor,
      name: `ags-notifications-${monitor}`,
      className: "notification-popups",
      anchor: ["top", "right"],
      margins: [8, 8, 8, 8],

      child: Widget.Box({
         css: "min-width: 2px; min-height: 2px;",
         className: "notifications",
         vertical: true,
         child: list,
      }),
   });
};
