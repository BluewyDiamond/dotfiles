import Notifd from "gi://AstalNotifd";
import { createBinding, createComputed } from "ags";
import icons from "../../../../icons";

const notifd = Notifd.get_default();

export default function () {
   const notificationsBinding = createBinding(notifd, "notifications");

   const iconNameComputed = createComputed(
      [notificationsBinding],
      (notifications) => {
         if (notifications.length > 0) {
            return icons.notification.noisy;
         } else {
            return icons.notification.normal;
         }
      }
   );

   return (
      <button cssClasses={["notifications-indicator-button"]}>
         <image iconName={iconNameComputed} />
      </button>
   );
}
