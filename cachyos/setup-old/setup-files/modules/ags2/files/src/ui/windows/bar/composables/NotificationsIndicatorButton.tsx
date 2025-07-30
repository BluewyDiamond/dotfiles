import Notifd from "gi://AstalNotifd";
import { createBinding, createComputed } from "ags";
import options from "../../../../options";

const notifd = Notifd.get_default();

export default function () {
   const notificationsBinding = createBinding(notifd, "notifications");

   const iconNameComputed = createComputed(
      [notificationsBinding],
      (notifications) => {
         if (notifications.length <= 0) {
            return options.bar.notificationsIndicator.icons.notificationNormal;
         } else {
            return options.bar.notificationsIndicator.icons.notificationNoisy;
         }
      }
   );

   return (
      <button cssClasses={["notifications-indicator-button"]}>
         <image iconName={iconNameComputed} />
      </button>
   );
}
