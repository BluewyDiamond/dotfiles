import { type Astal, type Gdk, Widget } from "astal/gtk4";
import PopupWindow, { Position } from "../composables/popupWindow";
import options from "../../options";
import { notificationsBox } from "./composables/notificationsBox";
import { quickSettingsBox } from "./composables/quickSettingsBox";

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   return PopupWindow(
      {
         gdkmonitor,
         name: options.controlCenter.name,
         cssClasses: ["control-center-window"],
         position: Position.TOP_RIGHT,
      },

      Widget.Box({
         cssClasses: ["main-box"],
         vertical: true,

         children: [quickSettingsBox(), notificationsBox()],
      })
   );
}
