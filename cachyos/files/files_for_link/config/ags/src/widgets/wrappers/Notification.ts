import { Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { findIcon, isValidIcon } from "../../utils";
import { GLib } from "astal";
import icons from "../../icons";
import { IconWithLabelFallback } from "./IconWithLabelFallback";
import Pango from "gi://Pango?version=1.0";

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
                           className: "notification-icon",
                        }),
                     ];
                  }

                  self.children = [
                     ...self.children,

                     new Widget.Box({
                        vertical: true,

                        setup: (self) => {
                           if (notification.summary) {
                              self.children = [
                                 ...self.children,
                                 new Widget.Label({
                                    className: "notification-summary",
                                    halign: Gtk.Align.START,
                                    xalign: 0,
                                    truncate: true,
                                    label: notification.summary,
                                 }),
                              ];
                           }

                           if (notification.body) {
                              self.children = [
                                 ...self.children,
                                 new Widget.Label({
                                    className: "notification-body",
                                    halign: Gtk.Align.START,
                                    xalign: 0,
                                    wrap: true,
                                    wrapMode: Pango.WrapMode.WORD_CHAR,
                                    label: notification.body,
                                 }),
                              ];
                           }
                        },
                     }),
                  ];
               },
            }),
         ],

         setup: (self) => {
            setup && setup();

            if (notification.actions.length > 0) {
               self.children = [
                  ...self.children,

                  new Widget.Box({
                     className: "notification-actions",
                     hexpand: true,

                     setup: (self) => {
                        if (notification.get_actions().length > 0) {
                           notification.get_actions().map(({ label, id }) => {
                              self.children = [
                                 ...self.children,

                                 new Widget.Button(
                                    {
                                       hexpand: true,
                                       onClicked: () => notification.invoke(id),
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
               ];
            }
         },
      }),
   });
}
