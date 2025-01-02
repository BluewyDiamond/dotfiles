import { Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { findIcon, isValidIcon } from "../../utils";
import { GLib } from "astal";
import icons from "../../libs/icons";
import { EventBoxProps } from "astal/gtk3/widget";
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

type Props = {
   setup?(): void;
};

export default function (
   notification: Notifd.Notification,
   props: Props
): Widget.EventBox {
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

                  self.children = [
                     IconWithLabelFallback(foundedIcon, {
                        setup: (self) => {
                           self.className = "notification-app-icon";
                        },
                     }),

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

                        IconWithLabelFallback(icons.ui.close, {})
                     ),
                  ];
               },
            }),

            new Gtk.Separator({ visible: true }),

            new Widget.Box({
               className: "notification-content",

               setup: (self) => {
                  if (notification.image && fileExists(notification.image)) {
                     self.children = [
                        ...self.children,

                        new Widget.Box({
                           className: "notification-image",
                           css: `background-image: url('${notification.image}')`,
                        }),
                     ];
                  }

                  if (notification.image && isValidIcon(notification.image)) {
                     self.children = [
                        ...self.children,

                        new Widget.Icon({
                           className: "notification-icon",
                           icon: notification.image,
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
                        ],
                     }),
                  ];
               },
            }),
         ],

         setup: () => {
            if (props.setup) {
               props.setup();
            }
         },
      }),
   });
}
