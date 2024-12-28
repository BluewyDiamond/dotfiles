import { Astal, Gtk, Widget } from "astal/gtk3";
import { EventBox } from "astal/gtk3/widget";
import Notifd from "gi://AstalNotifd";
import { curateIcon, searchIcon } from "../../utils";
import { IconWithLabelFallback } from "../wrappers";
import { GLib } from "astal";

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

export type Props = {
   setup(self: EventBox): void;
   onHoverLost(self: EventBox): void;
   notification: Notifd.Notification;
};

export default function (props: Props): Widget.EventBox {
   const { notification, onHoverLost, setup } = props;

   return new Widget.EventBox({
      className: `notification-urgency-${urgency(notification)}`,

      onHoverLost: onHoverLost,
      setup: setup,

      child: new Widget.Box({
         vertical: true,
         children: [
            new Widget.Box({
               className: "notification-header",

               setup: (self) => {
                  let curatedIcon = curateIcon(notification.app_icon);

                  if (curatedIcon === "") {
                     curatedIcon = curateIcon(notification.desktop_entry);
                  }

                  self.children = [
                     IconWithLabelFallback(curatedIcon),
                     new Widget.Label({
                        label: notification.appName || "undefined",
                     }),

                     new Widget.Label({ label: time(notification.time) }),

                     new Widget.Button({
                        child: new Widget.Label({ label: "x" }),
                        onClick: () => notification.dismiss(),
                     }),
                  ];
               },
            }),

            new Gtk.Separator({ visible: true }),

            new Widget.Box({
               className: "notification-content",

               setup: (self) => {
                  if (notification.image && fileExists(notification.image)) {
                     self.children.push(
                        new Widget.Box({
                           css: `background-image: url('${notification.image}')`,
                        })
                     );
                  }

                  if (notification.image && isIcon(notification.image)) {
                     self.children.push(
                        new Widget.Icon({
                           icon: notification.image,
                        })
                     );
                  }

                  self.children = [
                     ...self.children,

                     new Widget.Label({
                        label: notification.summary,
                     }),

                     new Widget.Label({
                        label: notification.body,
                     }),
                  ];
               },
            }),
         ],
      }),
   });
}
