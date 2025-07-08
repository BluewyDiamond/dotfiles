import Notifd from "gi://AstalNotifd";
import { createBinding } from "../../../../../../../../../../../../../../usr/share/ags/js/gnim/src/jsx";
import { Gtk } from "ags/gtk4";

const notifd = Notifd.get_default();

export default function () {
   let image: Gtk.Image;

   return (
      <image
         $={(self) => (image = self)}
         iconName={createBinding(notifd, "notifications").as(
            (notifications) => {
               if (notifications.length > 0) {
                  return "image";
               } else {
                  return "image";
               }
            }
         )}
      />
   );
}
