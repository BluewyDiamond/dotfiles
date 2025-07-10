import Notifd from "gi://AstalNotifd";
import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import icons from "../../../../icons";

const notifd = Notifd.get_default();

export default function () {
   let image: Gtk.Image;

   return (
      <image
         $={(self) => (image = self)}
         iconName={createBinding(notifd, "notifications").as(
            (notifications) => {
               if (notifications.length > 0) {
                  return icons.notification.noisy;
               } else {
                  return "image";
               }
            }
         )}
      />
   );
}
