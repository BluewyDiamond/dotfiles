import { Accessor, createComputed, createState, For, onCleanup } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import AstalNotifd from "gi://AstalNotifd";
import options from "../../../options";
import icons from "../../../lib/icons";
import { checkIconExists } from "../../../utils";
import Adw from "gi://Adw";

const notifd = AstalNotifd.get_default();

export default function (gdkmonitor: Accessor<Gdk.Monitor>) {
   const [notificationsState, setNotificationsState] = createState<
      AstalNotifd.Notification[]
   >([]);

   const notifiedSignalId = notifd.connect("notified", (_, id) => {
      const notification = notifd.get_notification(id);

      setNotificationsState((previousNotifications) => {
         return [notification, ...previousNotifications];
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
      <Adw.Clamp
         maximumSize={options.notificationToasts.notification.maximumSize}
      >
         <box
            cssClasses={["notification-toast-box"]}
            orientation={Gtk.Orientation.VERTICAL}
         >
            <box cssClasses={["notification-header-box"]} hexpand>
               {checkIconExists(notification.appIcon) && (
                  <image
                     cssClasses={["notification-app-image"]}
                     halign={Gtk.Align.START}
                     iconName={notification.app_icon}
                  />
               )}

               <label
                  cssClasses={["notification-summary-label"]}
                  halign={Gtk.Align.CENTER}
                  label={notification.summary}
               />

               <button
                  cssClasses={["notification-close-button"]}
                  halign={Gtk.Align.END}
                  onClicked={() => nuke()}
               >
                  <image iconName={icons.ui.close} />
               </button>
            </box>

            <box cssClasses={["notification-content-box"]}>
               {notification.get_image() && (
                  <image
                     cssClasses={["notification-body-image"]}
                     file={notification.get_image()}
                  />
               )}

               <label
                  cssClasses={["notification-body-label"]}
                  wrap
                  wrapMode={Gtk.WrapMode.WORD}
                  label={notification.body}
               />
            </box>

            {notification.actions.length > 0 && (
               <box cssClasses={["notification-action-area-box"]} hexpand>
                  {notification.actions.map((action) => (
                     <button
                        cssClasses={["notification-action-button"]}
                        hexpand
                        onClicked={() => notification.invoke(action.id)}
                     >
                        <label label={action.label} />
                     </button>
                  ))}
               </box>
            )}
         </box>
      </Adw.Clamp>
   );
}
