import { createComputed, createState, For, onCleanup } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import AstalNotifd from "gi://AstalNotifd";
import options from "../../../options";

const notifd = AstalNotifd.get_default();

export default function (gdkmonitor: Gdk.Monitor) {
   const [notificationsState, setNotificationsState] = createState<
      AstalNotifd.Notification[]
   >([]);

   const notifiedSignalId = notifd.connect("notified", (_, id) => {
      const notification = notifd.get_notification(id);

      setNotificationsState((previousNotifications) => {
         return [...previousNotifications, notification];
      });

      timeout(options.notificationToasts.timeout, () =>
         setNotificationsState((previousNotifications) => {
            return previousNotifications.filter(
               (previousNotification) => previousNotification.id !== id
            );
         })
      );
   });

   const resolvedSignalId = notifd.connect("resolved", (_, id) => {
      setNotificationsState((previousNotifications) => {
         return previousNotifications.filter(
            (previousNotification) => previousNotification.id !== id
         );
      });
   });

   onCleanup(() => {
      notifd.disconnect(notifiedSignalId);
      notifd.disconnect(resolvedSignalId);
   });

   const visible = createComputed([notificationsState], (notifications) =>
      notifications.length > 0 ? true : false
   );

   return (
      <window
         gdkmonitor={gdkmonitor}
         name="ags_notification_toasts"
         namespace="ags_notification_toasts"
         cssClasses={["notification-toasts-window"]}
         anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
         exclusivity={Astal.Exclusivity.EXCLUSIVE}
         application={app}
         visible={visible}
      >
         <box
            cssClasses={["notification-toasts-box"]}
            orientation={Gtk.Orientation.VERTICAL}
         >
            <For each={notificationsState}>
               {(notification) => (
                  <NotificationToastBox
                     notification={notification}
                     nuke={() =>
                        setNotificationsState((previousNotifications) =>
                           previousNotifications.filter(
                              (previousNotification) =>
                                 previousNotification.id !== notification.id
                           )
                        )
                     }
                  />
               )}
            </For>
         </box>
      </window>
   );
}

function NotificationToastBox({
   notification,
   nuke,
}: {
   notification: AstalNotifd.Notification;
   nuke: () => void;
}) {
   return (
      <box
         cssClasses={["notification-toast-box"]}
         orientation={Gtk.Orientation.VERTICAL}
      >
         <box>
            <image iconName={notification.app_icon} />
            <label label={notification.summary} />

            <button onClicked={() => nuke()}>
               <image iconName={""} />
            </button>
         </box>

         <box>
            <image file={notification.get_image()} />
            <label label={notification.body} />
         </box>
      </box>
   );
}
