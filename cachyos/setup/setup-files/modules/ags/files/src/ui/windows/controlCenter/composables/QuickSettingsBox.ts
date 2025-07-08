import { type Gtk, Widget } from "astal/gtk4";
import options from "../../../../options";
import { paginateBoxes } from "../../../../utils/widget";

export function quickSettingsBox(): Gtk.Box {
   const wifi = Widget.Box({
      children: [
         Widget.Button(
            {
               cssClasses: ["control-center-quick-settings-toggle-button"],
            },

            Widget.Label({ label: "Wifi" })
         ),

         Widget.Button(
            {
               cssClasses: ["control-center-quick-settings-expand-button"],
            },

            Widget.Label({ label: ">" })
         ),
      ],
   });

   const wifi2 = Widget.Box({
      children: [
         Widget.Button(
            {
               cssClasses: ["control-center-quick-settings-toggle-button"],
            },

            Widget.Label({ label: "Wifi" })
         ),

         Widget.Button(
            {
               cssClasses: ["control-center-quick-settings-expand-button"],
            },

            Widget.Label({ label: ">" })
         ),
      ],
   });

   let numberOfPages = 0;

   const stack = Widget.Stack({
      setup: (self) => {
         for (const paginatedBox of paginateBoxes(
            options.controlCenter.actions.rows,
            options.controlCenter.actions.columns,

            [wifi, wifi2]
         )) {
            self.add_named(paginatedBox, `${numberOfPages}`);
            numberOfPages++;
         }
      },
   });

   return Widget.Box({
      cssClasses: ["control-center-actions-quick-settings"],
      vertical: true,

      children: [
         stack,

         Widget.Box({
            cssClasses: ["control-center-quick-settings-pages-buttons"],

            setup: (self) => {
               for (let index = 0; index < numberOfPages; index++) {
                  self.append(
                     Widget.Button({
                        cssClasses: [
                           "control-center-quick-settings-page-number-button",
                        ],
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
