import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import icons from "../../icons";
import Variable from "astal/variable";
import { execAsync, interval } from "astal";
import PopupWindow, { LayoutPosition } from "../wrappers/PopupWindow";

function hide() {
   App.get_window("astal-power-menu")?.hide();
}

function powerButtonSetup(self: Gtk.Button, clickCount: Variable<number>) {
   let countingDown = false;

   clickCount.subscribe((count) => {
      if (count === 1) {
         self.cssClasses = [...self.cssClasses, "one"];

         self.cssClasses = self.cssClasses.filter(
            (cssClass) => cssClass !== "two" && cssClass !== "three"
         );
      } else if (count === 2) {
         self.cssClasses = [...self.cssClasses, "two"];

         self.cssClasses = self.cssClasses.filter(
            (cssClass) => cssClass !== "one" && cssClass !== "three"
         );
      } else if (count === 3) {
         self.cssClasses = [...self.cssClasses, "three"];

         self.cssClasses = self.cssClasses.filter(
            (cssClass) => cssClass !== "one" && cssClass !== "two"
         );
      }

      if (clickCount.get() === 0) {
         return;
      }

      if (countingDown) return;
      countingDown = true;

      const gc = interval(3000, () => {
         if (clickCount.get() === 0) {
            gc.cancel();
            countingDown = false;
            return;
         }

         clickCount.set(clickCount.get() - 1);
      });
   });
}

function onPowerButtonClicked(
   clickCount: Variable<number>,
   onConditionsMet: () => void
) {
   clickCount.set(clickCount.get() + 1);

   if (clickCount.get() !== 3) {
      return;
   }

   hide();
   clickCount.set(0);
   onConditionsMet();
}

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const sleepClickCount = Variable(0);
   const rebootClickCount = Variable(0);
   const poweroffClickCount = Variable(0);

   return PopupWindow(
      {
         gdkmonitor: gdkmonitor,
         name: "astal-power-menu",
         cssClasses: ["power-menu"],
         position: LayoutPosition.CENTER,
      },

      Widget.Box({
         cssClasses: ["power-menu-content"],

         children: [
            Widget.Button(
               {
                  onClicked: () => {
                     onPowerButtonClicked(sleepClickCount, () => {
                        execAsync(["fish", "-c", "systemctl suspend"]);
                     });
                  },

                  setup: (self) => {
                     powerButtonSetup(self, sleepClickCount);
                  },
               },

               IconWithLabelFallback({
                  iconName: icons.powermenu.sleep,
               })
            ),

            Widget.Button(
               {
                  onClicked: () => {
                     onPowerButtonClicked(rebootClickCount, () => {
                        execAsync(["fish", "-c", "systemctl poweroff"]);
                     });
                  },

                  setup: (self) => {
                     powerButtonSetup(self, rebootClickCount);
                  },
               },

               IconWithLabelFallback({
                  iconName: icons.powermenu.reboot,
               })
            ),

            Widget.Button(
               {
                  onClicked: () => {
                     onPowerButtonClicked(poweroffClickCount, () => {
                        execAsync(["fish", "-c", "systemctl poweroff"]);
                     });
                  },

                  setup: (self) => {
                     powerButtonSetup(self, poweroffClickCount);
                  },
               },

               IconWithLabelFallback({
                  iconName: icons.powermenu.shutdown,
               })
            ),
         ],
      })
   );
}
