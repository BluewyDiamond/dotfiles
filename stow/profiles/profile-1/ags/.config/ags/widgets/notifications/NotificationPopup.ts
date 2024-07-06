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

/** @param {import('resource:///com/github/Aylur/ags/service/notifications.js').Notification} n */
function Notification2(n: Notification) {
   const icon = Widget.Box({
      vpack: "start",
      className: "icon",
      child: NotificationIcon(n),
   });

   const title = Widget.Label({
      className: "title",
      xalign: 0,
      justification: "left",
      hexpand: true,
      max_width_chars: 24,
      truncate: "end",
      wrap: true,
      label: n.summary,
      use_markup: true,
   });

   const body = Widget.Label({
      className: "body",
      hexpand: true,
      use_markup: true,
      xalign: 0,
      justification: "left",
      label: n.body,
      wrap: true,
   });

   const actions = Widget.Box({
      className: "actions",

      children: n.actions.map(({ id, label }) =>
         Widget.Button({
            className: "action-button",

            onClicked: () => {
               n.invoke(id);
               n.dismiss();
            },

            hexpand: true,
            child: Widget.Label(label),
         })
      ),
   });

   return Widget.EventBox(
      {
         attribute: { id: n.id },
         onPrimaryClick: n.dismiss,
      },

      Widget.Box(
         {
            className: `notification ${n.urgency}`,
            vertical: true,
         },

         Widget.Box([icon, Widget.Box({ vertical: true }, title, body)]),
         actions
      )
   );
}

export default (monitor: number = 0) => {
   const list = Widget.Box({
      vertical: true,
      children: notifications.popups.map(Notification2),
   });

   function onNotified(_: any, id: number) {
      const n = notifications.getNotification(id);
      if (n) list.children = [Notification2(n), ...list.children];
   }

   function onDismissed(_: any, id: number) {
      list.children.find((n) => n.attribute.id === id)?.destroy();
   }

   list
      .hook(notifications, onNotified, "notified")
      .hook(notifications, onDismissed, "dismissed");

   return Widget.Window({
      monitor,
      name: `notifications${monitor}`,
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
