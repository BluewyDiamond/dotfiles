import { App, Gdk, Widget } from "astal/gtk3";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import icons from "../../libs/icons";
import Variable from "astal/variable";
import { execAsync, interval } from "astal";

function hide() {
   App.get_window("astal-power-menu")?.hide();
}

function powerButtonSetup(self: Widget.Button, clickCount: Variable<number>) {
   let countingDown = false;

   clickCount.subscribe((count) => {
      self.toggleClassName("one", count === 1);
      self.toggleClassName("two", count === 2);
      self.toggleClassName("three", count === 3);

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

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const sleepClickCount = Variable(0);
   const rebootClickCount = Variable(0);
   const poweroffClickCount = Variable(0);

   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-power-menu",
      className: "power-menu",
      visible: false,

      child: new Widget.Box({
         className: "power-menu-content",

         children: [
            new Widget.Button(
               {
                  onClick: () => {
                     onPowerButtonClicked(sleepClickCount, () => {
                        execAsync(["fish", "-c", "systemctl suspend"]);
                     });
                  },

                  setup: (self) => {
                     powerButtonSetup(self, sleepClickCount);
                  },
               },

               IconWithLabelFallback({ icon: icons.powermenu.sleep })
            ),

            new Widget.Button(
               {
                  onClick: () => {
                     onPowerButtonClicked(rebootClickCount, () => {
                        execAsync(["fish", "-c", "systemctl poweroff"]);
                     });
                  },

                  setup: (self) => {
                     powerButtonSetup(self, rebootClickCount);
                  },
               },

               IconWithLabelFallback({ icon: icons.powermenu.reboot })
            ),

            new Widget.Button(
               {
                  onClick: () => {
                     onPowerButtonClicked(poweroffClickCount, () => {
                        execAsync(["fish", "-c", "systemctl poweroff"]);
                     });
                  },

                  setup: (self) => {
                     powerButtonSetup(self, poweroffClickCount);
                  },
               },

               IconWithLabelFallback({ icon: icons.powermenu.shutdown })
            ),
         ],
      }),
   });
}
