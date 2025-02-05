import { Gtk, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { GLib } from "astal";
import icons, { createIcon } from "../../libs/icons";
import { IconWithLabelFallback } from "./IconWithLabelFallback";
import Pango from "gi://Pango?version=1.0";
import options from "../../options";
import { findIcon } from "../../utils/image";

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
      cssClasses: ["notification", urgency(notification)],
      vertical: true,
      hexpand: false,

      children: [
         Widget.Box({
            cssClasses: ["header"],

            setup: (self) => {
               let foundedIcon = findIcon(notification.app_icon);

               if (foundedIcon === "") {
                  foundedIcon = findIcon(notification.desktop_entry);
               }

               self.children = [
                  ...self.children,

                  IconWithLabelFallback({
                     cssClasses: ["app-icon"],
                     icon: createIcon(foundedIcon),
                     fallbackIcon: icons.fallback.notification,

                     fallbackIconIsSymbolic:
                        options.notification.fallbackIcon.symbolic,

                     fallbackLabel: ">",
                  }),
               ];

               self.children = [
                  ...self.children,

                  Widget.Label({
                     halign: Gtk.Align.START,
                     cssClasses: ["app-name"],
                     ellipsize: Pango.EllipsizeMode.END,
                     label: notification.appName || "undefined",
                  }),

                  Widget.Label({
                     halign: Gtk.Align.END,
                     cssClasses: ["time"],
                     hexpand: true,
                     label: time(notification.time),
                  }),

                  Widget.Button(
                     {
                        cssClasses: ["close"],
                        onClicked: () => notification.dismiss(),
                     },

                     IconWithLabelFallback({
                        icon: icons.ui.close,
                        symbolic: options.notification.closeIcon.symbolic,
                     })
                  ),
               ];
            },
         }),

         new Gtk.Separator({
            cssClasses: ["separator"],
            hexpand: true,
            visible: true,
         }),

         Widget.Box({
            cssClasses: ["content"],

            setup: (self) => {
               if (
                  notification.image &&
                  GLib.file_test(notification.image, GLib.FileTest.EXISTS)
               ) {
                  self.children = [
                     ...self.children,

                     Widget.Image({
                        cssClasses: ["image"],
                        file: notification.image,
                        halign: Gtk.Align.START,
                        valign: Gtk.Align.START,
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
                                 cssClasses: ["summary"],
                                 halign: Gtk.Align.START,
                                 xalign: 0,
                                 wrap: true,
                                 wrapMode: Pango.WrapMode.WORD_CHAR,
                                 label: notification.summary,
                              }),
                           ];
                        }

                        if (notification.body) {
                           self.children = [
                              ...self.children,

                              Widget.Label({
                                 cssClasses: ["body"],
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
                  cssClasses: ["actions"],
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
