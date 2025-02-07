import { type Astal, type Gdk, type Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../composables/IconWithLabelFallback";
import icons from "../../libs/icons";
import Variable from "astal/variable";
import { type AstalIO, execAsync, interval, timeout } from "astal";
import PopupWindow, { Position } from "../composables/PopupWindow";

function PowerButton(widget: Gtk.Widget, onThree: () => void): Gtk.Button {
   const clicks = Variable(0);
   let onInactive: AstalIO.Time | null = null;
   let countDown: AstalIO.Time | null = null;

   return Widget.Button(
      {
         onClicked: () => {
            countDown?.cancel();
            countDown = null;
            onInactive?.cancel();
            onInactive = null;

            clicks.set(clicks.get() + 1);

            onInactive = timeout(3000, () => {
               countDown = interval(3000, () => {
                  const clicksValue = clicks.get();

                  if (clicksValue > 0) {
                     clicks.set(clicksValue - 1);
                  } else {
                     countDown?.cancel();
                  }
               });
            });
         },

         setup: (self) => {
            clicks.subscribe((clicks) => {
               self.cssClasses = self.cssClasses.filter(
                  (cssClass) => !["one", "two", "three"].includes(cssClass)
               );

               if (clicks === 1) {
                  self.cssClasses = [...self.cssClasses, "one"];
               } else if (clicks === 2) {
                  self.cssClasses = [...self.cssClasses, "two"];
               } else if (clicks === 3) {
                  self.cssClasses = [...self.cssClasses, "three"];

                  timeout(1000, () => {
                     onThree();
                  });
               } else if (clicks > 3) {
                  self.cssClasses = [...self.cssClasses, "three"];
               }
            });
         },
      },

      widget
   );
}

// Create the power menu popup window
export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   return PopupWindow(
      {
         gdkmonitor,
         name: "astal-power-menu",
         cssClasses: ["power-menu"],
         position: Position.CENTER,
      },

      Widget.Box({
         cssClasses: ["main-box"],

         children: [
            PowerButton(
               IconWithLabelFallback({ icon: icons.powermenu.sleep }),

               () => {
                  void execAsync(["fish", "-c", "systemctl suspend"]);
               }
            ),

            PowerButton(
               IconWithLabelFallback({ icon: icons.powermenu.reboot }),

               () => {
                  void execAsync(["fish", "-c", "systemctl reboot"]);
               }
            ),

            PowerButton(
               IconWithLabelFallback({ icon: icons.powermenu.shutdown }),

               () => {
                  void execAsync(["fish", "-c", "systemctl poweroff"]);
               }
            ),
         ],
      })
   );
}
