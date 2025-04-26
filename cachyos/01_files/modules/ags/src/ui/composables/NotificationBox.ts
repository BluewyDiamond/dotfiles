import { Gtk, Widget } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { GLib } from "astal";
import icons from "../../libs/icons";
import { IconWithLabelFallback } from "./IconWithLabelFallback";
import Pango from "gi://Pango?version=1.0";
import { findIcon } from "../../utils/image";
import { LabelWithOverhead } from "../../utils/widget";
import options from "../../options";

function getUrgency(n: Notifd.Notification): string {
   switch (n.urgency) {
      case Notifd.Urgency.LOW:
         return "low";
      case Notifd.Urgency.CRITICAL:
         return "critical";
      case Notifd.Urgency.NORMAL:
      default:
         return "normal";
   }
}

function time(time: number, format = "%H:%M"): string {
   return GLib.DateTime.new_from_unix_local(time).format(format) ?? "?";
}

interface NotificationProps {
   notification: Notifd.Notification;
   setup?: () => void;
}

export default function (props: NotificationProps): Gtk.Box {
   const { notification, setup } = props;

   return Widget.Box({
      cssClasses: ["notification", getUrgency(notification)],
      vertical: true,
      hexpand: false,

      children: [
         Widget.Box({
            cssClasses: ["header"],

            setup: (self) => {
               let foundedIcon = findIcon(notification.app_icon);

               if (foundedIcon === "") {
                  const desktopEntry = notification.desktopEntry as
                     | string
                     | null;

                  if (desktopEntry !== null) {
                     foundedIcon = findIcon(desktopEntry);
                  }
               }

               self.children = [
                  ...self.children,

                  IconWithLabelFallback({
                     cssClasses: ["app-icon"],
                     iconName: foundedIcon,
                  }),

                  Widget.Label({
                     halign: Gtk.Align.START,
                     cssClasses: ["app-name"],
                     ellipsize: Pango.EllipsizeMode.END,

                     label:
                        notification.appName === "" ?
                           "unnamed"
                        :  notification.appName,
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

                        onClicked: () => {
                           notification.dismiss();
                        },
                     },

                     IconWithLabelFallback({
                        iconName: icons.ui.close.symbolic,
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
               const notificationImage = notification.image as string | null;

               if (
                  notificationImage !== null &&
                  notificationImage !== "" &&
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
                        if (notification.summary !== "") {
                           self.children = [
                              ...self.children,

                              Widget.Label({
                                 cssClasses: ["summary"],
                                 halign: Gtk.Align.START,
                                 xalign: 0,
                                 wrap: true,
                                 wrapMode: Pango.WrapMode.WORD_CHAR,
                                 useMarkup: true,
                                 label: notification.summary,
                              }),
                           ];
                        }

                        if (notification.body !== "") {
                           self.children = [
                              ...self.children,

                              Widget.Label({
                                 cssClasses: ["body"],
                                 hexpand: true,
                                 halign: Gtk.Align.START,
                                 xalign: 0,
                                 wrap: true,
                                 wrapMode: Pango.WrapMode.WORD_CHAR,
                                 maxWidthChars: options.general.maxChars,
                                 useMarkup: true,
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
         setup !== undefined && setup();

         if (notification.actions.length > 0) {
            self.children = [
               ...self.children,

               Widget.Box({
                  cssClasses: ["actions"],
                  hexpand: true,

                  setup: (self) => {
                     if (notification.get_actions().length > 0) {
                        notification.get_actions().forEach(({ label, id }) => {
                           self.children = [
                              ...self.children,

                              Widget.Button(
                                 {
                                    hexpand: true,

                                    onClicked: () => {
                                       notification.invoke(id);
                                    },
                                 },

                                 Widget.Label({
                                    label,
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
