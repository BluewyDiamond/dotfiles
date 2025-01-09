import { Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { findIcon, isValidIcon } from "../../utils";
import { GLib } from "astal";
import icons from "../../libs/icons";
import { IconWithLabelFallback } from "./IconWithLabelFallback";

const urgency = (n: Notifd.Notification) => {
   const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;
   switch (n.urgency) {
      case LOW:
         return "low";
      case CRITICAL:
         return "critical";
      case NORMAL:
      default:
         return "normal";
   }
};

const time = (time: number, format = "%H:%M") =>
   GLib.DateTime.new_from_unix_local(time).format(format)!;

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

type NotificationProps = {
   notification: Notifd.Notification;
   setup?(): void;
};

export default function (props: NotificationProps): Widget.EventBox {
   const { notification, setup } = props;

   return new Widget.EventBox({
      child: new Widget.Box({
         className: "notification",
         vertical: true,

         children: [
            new Widget.Box({
               className: "notification-header",

               setup: (self) => {
                  let foundedIcon = findIcon(notification.app_icon);

                  if (foundedIcon === "") {
                     foundedIcon = findIcon(notification.desktop_entry);
                  }

                  if (foundedIcon) {
                     self.children = [
                        ...self.children,

                        new Widget.Icon({
                           className: "notification-app-icon",
                           icon: foundedIcon,
                        }),
                     ];
                  }

                  self.children = [
                     ...self.children,

                     new Widget.Label({
                        halign: Gtk.Align.START,
                        className: "notification-app-name",
                        truncate: true,
                        label: notification.appName || "undefined",
                     }),

                     new Widget.Label({
                        halign: Gtk.Align.END,
                        className: "notification-time",
                        hexpand: true,
                        label: time(notification.time),
                     }),

                     new Widget.Button(
                        {
                           className: "notification-close",
                           onClick: () => notification.dismiss(),
                        },

                        IconWithLabelFallback({ icon: icons.ui.close })
                     ),
                  ];
               },
            }),

            new Gtk.Separator({ visible: true }),

            new Widget.Box({
               className: "notification-content",

               setup: (self) => {
                  if (notification.image && isValidIcon(notification.image)) {
                     self.children = [
                        ...self.children,

                        IconWithLabelFallback({
                           icon: notification.image,

                           iconProps: {
                              className: "notification-icon",
                           },
                        }),
                     ];
                  }

                  self.children = [
                     ...self.children,

                     new Widget.Box({
                        vertical: true,

                        children: [
                           new Widget.Label({
                              className: "notification-summary",
                              halign: Gtk.Align.START,
                              xalign: 0,
                              label: notification.summary,
                           }),

                           new Widget.Label({
                              className: "notification-body",
                              halign: Gtk.Align.START,
                              xalign: 0,
                              label: notification.body,
                           }),

                           new Widget.Box({
                              className: "notification-actions",

                              setup: (self) => {
                                 if (notification.get_actions().length > 0) {
                                    notification
                                       .get_actions()
                                       .map(({ label, id }) => {
                                          self.children = [
                                             ...self.children,

                                             new Widget.Button(
                                                {
                                                   hexpand: true,

                                                   onClicked: () =>
                                                      notification.invoke(id),
                                                },

                                                new Widget.Label({
                                                   label: label,
                                                   halign: Gtk.Align.CENTER,
                                                   hexpand: true,
                                                })
                                             ),
                                          ];
                                       });
                                 }
                              },
                           }),
                        ],
                     }),
                  ];
               },
            }),
         ],

         setup: setup,
      }),
   });
}
