import { Astal, type Gdk, Widget } from "astal/gtk4";
import PopupWindow, { Position } from "../../composables/PopupWindow";
import options from "../../../options";
import NotificationsBox from "./composables/notifications2/NotificationsBox";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   return PopupWindow(
      {
         gdkmonitor,
         name: options.controlCenter.name,
         cssClasses: ["control-center-window"],
         exclusivity: Astal.Exclusivity.NORMAL,
         position: Position.TOP_RIGHT,
      },

      Widget.Box({
         cssClasses: ["main-box"],
         vertical: true,

         children: [NotificationsBox()],
      })
   );
}
