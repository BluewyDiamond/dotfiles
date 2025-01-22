import { Gtk, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { findIcon, isValidImage } from "../../utils";
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

export default function (props: NotificationProps): Gtk.Box {
   const { notification, setup } = props;

   return Widget.Box({
      cssClasses: ["notification"],
      vertical: true,

      children: [
         Widget.Box({
            cssClasses: ["notification-header"],

            setup: (self) => {
               let foundedIcon = findIcon(notification.app_icon);

               if (foundedIcon === "") {
                  foundedIcon = findIcon(notification.desktop_entry);
               }

               if (foundedIcon) {
                  self.children = [
                     ...self.children,

                     IconWithLabelFallback({
                        cssClasses: ["notification-app-icon"],
                        iconName: foundedIcon,
                     }),
                  ];
               }

               self.children = [
                  ...self.children,

                  Widget.Label({
                     halign: Gtk.Align.START,
                     cssClasses: ["notification-app-name"],
                     ellipsize: Pango.EllipsizeMode.END,
                     label: notification.appName || "undefined",
                  }),

                  Widget.Label({
                     halign: Gtk.Align.END,
                     cssClasses: ["notification-time"],
                     hexpand: true,
                     label: time(notification.time),
                  }),

                  Widget.Button(
                     {
                        cssClasses: ["notification-close"],
                        onClicked: () => notification.dismiss(),
                     },

                     IconWithLabelFallback({ iconName: icons.ui.close })
                  ),
               ];
            },
         }),

         new Gtk.Separator({ visible: true }),

         Widget.Box({
            cssClasses: ["notification-content"],

            setup: (self) => {
               if (notification.image && isValidImage(notification.image)) {
                  self.children = [
                     ...self.children,

                     Widget.Image({
                        cssClasses: ["notification-image"],
                        file: notification.image,
                     }),
                  ];
               }

               self.children = [
                  ...self.children,

                  Widget.Box({
                     vertical: true,

                     setup: (self) => {
                        if (notification.summary) {
                           self.children = [
                              ...self.children,

                              Widget.Label({
                                 cssClasses: ["notification-summary"],
                                 halign: Gtk.Align.START,
                                 xalign: 0,
                                 ellipsize: Pango.EllipsizeMode.END,
                                 label: notification.summary,
                              }),
                           ];
                        }

                        if (notification.body) {
                           self.children = [
                              ...self.children,

                              Widget.Label({
                                 cssClasses: ["notification-body"],
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

               Widget.Box({
                  cssClasses: ["notification-actions"],
                  hexpand: true,

                  setup: (self) => {
                     if (notification.get_actions().length > 0) {
                        notification.get_actions().map(({ label, id }) => {
                           self.children = [
                              ...self.children,

                              Widget.Button(
                                 {
                                    hexpand: true,
                                    onClicked: () => notification.invoke(id),
                                 },

                                 Widget.Label({
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
   });
}
