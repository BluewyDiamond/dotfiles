import { type Astal, type Gdk, type Gtk, Widget } from "astal/gtk4";
import PopupWindow, { Position } from "../composables/popupWindow";
import options from "../../options";
import { paginateBoxes } from "../../utils/widget";
import { NotificationMap, NotificationPagesMap } from "./NotificationMap";
import { bind, Variable } from "astal";
import { Label } from "astal/gtk4/widget";

function QuickSettingsBox(): Gtk.Box {
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

function NotificationsBox3(): Gtk.Box {
   const notificationPagesMap = new NotificationPagesMap();

   const stack = Widget.Stack({
      cssClasses: ["control-center-notifications-stack"],
   });

   function onNotificationPagesChanged(list: Gtk.Widget[]): void {
      list.forEach((item, index) => {
         const x = stack.get_child_by_name(index.toString());

         if (x !== null) {
            stack.remove(x);
         }

         stack.add_named(item, index.toString());
      });
   }

   onNotificationPagesChanged(notificationPagesMap.get());

   notificationPagesMap.subscribe((list) => {
      onNotificationPagesChanged(list);
   });

   return Widget.Box({
      vertical: true,

      setup: (self) => {
         self.append(stack);

         self.append(
            Widget.Box({
               setup: (self) => {
                  notificationPagesMap.subscribe((list) => {
                     self.children = [];

                     const idVariable = Variable(-1);

                     const update = (): void => {
                        const name = stack.get_visible_child_name();
                        if (name === null) return;
                        const id = parseInt(name);
                        idVariable.set(id);
                     };

                     update();

                     self.append(
                        Widget.Button(
                           {
                              onClicked: () => {
                                 update();

                                 if (idVariable.get() <= 0) {
                                    return;
                                 }

                                 stack.set_visible_child_name(
                                    (idVariable.get() - 1).toString()
                                 );
                              },
                           },
                           Widget.Label({ label: "<" })
                        )
                     );

                     self.append(
                        Widget.Label({
                           label: bind(idVariable).as(
                              (value) => `1..${value + 1}..${list.length}`
                           ),
                        })
                     );

                     self.append(
                        Widget.Button(
                           {
                              onClicked: () => {
                                 update();

                                 if (idVariable.get() >= list.length) {
                                    return;
                                 }

                                 stack.set_visible_child_name(
                                    (idVariable.get() + 1).toString()
                                 );
                              },
                           },
                           Widget.Label({ label: ">" })
                        )
                     );
                  });
               },
            })
         );
      },
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

         children: [QuickSettingsBox(), NotificationsBox3()],
      })
   );
}
