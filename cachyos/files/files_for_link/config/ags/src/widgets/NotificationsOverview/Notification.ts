import { Astal, Gtk, Widget } from "astal/gtk3";
import { EventBox } from "astal/gtk3/widget";
import Notifd from "gi://AstalNotifd";
import { findIcon } from "../../utils";
import { IconWithLabelFallback } from "../wrappers";
import { GLib } from "astal";
import icons from "../../libs/icons";

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

const isIcon = (icon: string) => !!Astal.Icon.lookup_icon(icon);

const time = (time: number, format = "%H:%M") =>
   GLib.DateTime.new_from_unix_local(time).format(format)!;

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

export default function (notification: Notifd.Notification): Widget.EventBox {
   return new Widget.EventBox({
      child: new Widget.Box({
         className: "notification",
         vertical: true,

         children: [
            new Widget.Box({
               className: "notification-header",

               setup: (self) => {
                  let curatedIcon = findIcon(notification.app_icon);

                  if (curatedIcon === "") {
                     curatedIcon = findIcon(notification.desktop_entry);
                  }

                  self.children = [
                     IconWithLabelFallback(curatedIcon, {
                        setup: (self) => {
                           self.className = "notification-app-icon";
                        },
                     }),

                     new Widget.Label({
                        halign: Gtk.Align.START,
                        className: "notification-app-name",
                        label: notification.appName || "undefined",
                     }),

                     new Widget.Label({
                        halign: Gtk.Align.END,
                        className: "notification-time",
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
               vertical: true,

               setup: (self) => {
                  if (notification.image && fileExists(notification.image)) {
                     self.children.push(
                        new Widget.Box({
                           className: "notification-image",
                           css: `background-image: url('${notification.image}')`,
                        })
                     );
                  }

                  if (notification.image && isIcon(notification.image)) {
                     self.children.push(
                        new Widget.Icon({
                           className: "notification-icon",
                           icon: notification.image,
                        })
                     );
                  }

                  self.children.push(
                     new Widget.Label({
                        className: "notification-summary",
                        label: notification.summary,
                     }),

                     new Widget.Label({
                        className: "notification-body",
                        label: notification.body,
                     })
                  );
               },
            }),
         ],
      }),
   });
}
