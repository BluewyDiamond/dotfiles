import { type Astal, type Gdk, type Gtk, Widget } from "astal/gtk4";
import PopupWindow, { Position } from "../composables/popupWindow";
import options from "../../options";
import { paginateBoxes } from "../../utils/widget";
import { notificationsBox } from "./composables/notificationsBox";

function quickSettingsBox(): Gtk.Box {
   const wifi = Widget.Box({
      children: [
         Widget.Button(
            {
               cssClasses: ["control-center-first-half-button"],
            },

            Widget.Label({ label: "Wifi" })
         ),

         Widget.Button(
            {
               cssClasses: ["control-center-second-half-button"],
            },

            Widget.Label({ label: ">" })
         ),
      ],
   });

   let numberOfPages = 0;

   const stack = Widget.Stack({
      cssClasses: ["control-center-actions-stack"],

      setup: (self) => {
         for (const paginatedBox of paginateBoxes(
            options.controlCenter.actions.rows,
            options.controlCenter.actions.columns,

            [
               wifi,
               Widget.Label({ label: "test" }),
               Widget.Label({ label: "test" }),
               Widget.Label({ label: "test" }),
               Widget.Label({ label: "test" }),
               Widget.Label({ label: "test" }),
               Widget.Label({ label: "test" }),
            ]
         )) {
            self.add_named(paginatedBox, `${numberOfPages}`);
            numberOfPages++;
         }
      },
   });

   return Widget.Box({
      vertical: true,

      children: [
         stack,

         Widget.Box({
            setup: (self) => {
               for (let index = 0; index < numberOfPages; index++) {
                  self.append(
                     Widget.Button({
                        cssClasses: ["control-center-page-button"],
                        child: Widget.Label({ label: `${index}` }),

                        onClicked: () => {
                           stack.set_visible_child_name(`${index}`);
                        },
                     })
                  );
               }
            },
         }),
      ],
   });
}

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
