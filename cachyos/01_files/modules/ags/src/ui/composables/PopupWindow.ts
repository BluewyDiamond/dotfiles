import { AstalIO, interval } from "astal";
import { App, Astal, Gdk, Gtk, hook, Widget } from "astal/gtk4";
import { matchInputRegionOfWidget } from "../../utils/widget";

export enum Position {
   TOP_LEFT,
   TOP_CENTER,
   TOP_RIGHT,
   CENTER,
}

export interface PopupWindowProps {
   gdkmonitor?: Gdk.Monitor;
   name: string;
   cssClasses?: string[];
   exclusivity?: Astal.Exclusivity;
   layer?: Astal.Layer;
   keymode?: Astal.Keymode;
   position: Position;
   clickThroughFiller?: boolean;
   onFillerClicked?: () => void;
   onKeyReleasedEvent?: (self: Gtk.Widget, event: number) => void;
   onDestroyed?: (self: Gtk.Window) => void;
   setup?: (self: Gtk.Window) => void;
}

// This implementation no longer fixes label wrapping
// and use max chars width instead.
export default function (
   popupWindowProps: PopupWindowProps,
   child: Gtk.Widget
): Astal.Window {
   const {
      gdkmonitor,
      name,
      cssClasses,
      exclusivity,
      layer,
      keymode,
      position,
      clickThroughFiller,
      onFillerClicked,
      onKeyReleasedEvent,
      onDestroyed,
      setup,
   } = popupWindowProps;

   const curatedCallback = (): void => {
      if (onFillerClicked !== undefined) {
         onFillerClicked();
         return;
      }

      App.get_window(name)?.hide();
   };

   let widget: Gtk.Widget | null = null;

   // For a grid system I could have used a for loop but gave up because I didn't want to think
   // and the grid is relatively small so this is good enough.
   if (position === Position.TOP_LEFT) {
      widget = Widget.Box({
         hexpand: true,
         vexpand: true,

         children: [
            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Box({
                     hexpand: true,
                     vexpand: true,

                     children: [
                        Widget.Button({
                           cssClasses: ["left-offset"],
                           hexpand: false,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),

                        Widget.Box({
                           hexpand: false,
                           vexpand: false,
                           vertical: true,

                           children: [
                              Widget.Button({
                                 cssClasses: ["top-offset"],
                                 hexpand: true,
                                 vexpand: false,
                                 canFocus: false,
                                 onClicked: curatedCallback,
                              }),

                              child,

                              Widget.Button({
                                 hexpand: true,
                                 vexpand: true,
                                 canFocus: false,
                                 onClicked: curatedCallback,
                              }),
                           ],
                        }),

                        Widget.Button({
                           hexpand: true,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),
                     ],
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),
         ],
      });
   } else if (position === Position.TOP_CENTER) {
      widget = Widget.Box({
         hexpand: true,
         vexpand: true,

         children: [
            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Box({
                     hexpand: true,
                     vexpand: true,

                     children: [
                        Widget.Button({
                           hexpand: true,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),

                        Widget.Box({
                           hexpand: false,
                           vexpand: false,
                           vertical: true,

                           children: [
                              Widget.Button({
                                 cssClasses: ["top-offset"],
                                 hexpand: true,
                                 vexpand: false,
                                 canFocus: false,
                                 onClicked: curatedCallback,
                              }),

                              child,

                              Widget.Button({
                                 hexpand: true,
                                 vexpand: true,
                                 canFocus: false,
                                 onClicked: curatedCallback,
                              }),
                           ],
                        }),

                        Widget.Button({
                           // cssClasses: ["right-offset"],
                           hexpand: false,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),
                     ],
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),
         ],
      });
   } else if (position === Position.CENTER) {
      widget = Widget.CenterBox({
         hexpand: true,
         vexpand: true,

         startWidget: Widget.CenterBox({
            orientation: Gtk.Orientation.VERTICAL,

            startWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),

            centerWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),

            endWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),
         }),

         centerWidget: Widget.CenterBox({
            orientation: Gtk.Orientation.VERTICAL,

            startWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),

            centerWidget: Widget.Box({
               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Box({
                     vertical: true,

                     children: [
                        Widget.Button({
                           hexpand: true,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),

                        child,

                        Widget.Button({
                           hexpand: true,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),
                     ],
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            endWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),
         }),

         endWidget: Widget.CenterBox({
            orientation: Gtk.Orientation.VERTICAL,
            startWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),

            centerWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),

            endWidget: Widget.Button({
               hexpand: true,
               vexpand: true,
               canFocus: false,
               onClicked: curatedCallback,
            }),
         }),
      });
   } else if (position === Position.TOP_RIGHT) {
      widget = Widget.Box({
         hexpand: true,
         vexpand: true,

         children: [
            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),

            Widget.Box({
               hexpand: true,
               vexpand: true,
               vertical: true,

               children: [
                  Widget.Box({
                     hexpand: true,
                     vexpand: true,

                     children: [
                        Widget.Button({
                           hexpand: true,
                           vexpand: true,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),

                        Widget.Box({
                           hexpand: false,
                           vexpand: false,
                           vertical: true,

                           children: [
                              Widget.Button({
                                 cssClasses: ["top-offset"],
                                 hexpand: true,
                                 vexpand: false,
                                 canFocus: false,
                                 onClicked: curatedCallback,
                              }),

                              child,

                              Widget.Button({
                                 hexpand: true,
                                 vexpand: true,
                                 canFocus: false,
                                 onClicked: curatedCallback,
                              }),
                           ],
                        }),

                        Widget.Button({
                           cssClasses: ["right-offset"],
                           hexpand: false,
                           vexpand: false,
                           canFocus: false,
                           onClicked: curatedCallback,
                        }),
                     ],
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),

                  Widget.Button({
                     hexpand: true,
                     vexpand: true,
                     canFocus: false,
                     onClicked: curatedCallback,
                  }),
               ],
            }),
         ],
      });
   }

   const window = Widget.Window(
      {
         gdkmonitor,
         name,
         namespace: name,
         cssClasses,
         visible: false,

         exclusivity: exclusivity ?? Astal.Exclusivity.IGNORE,
         layer: layer ?? Astal.Layer.TOP,
         keymode: keymode ?? Astal.Keymode.EXCLUSIVE,

         anchor:
            Astal.WindowAnchor.TOP |
            Astal.WindowAnchor.BOTTOM |
            Astal.WindowAnchor.RIGHT |
            Astal.WindowAnchor.LEFT,

         onKeyReleased: (self, event) => {
            if (onKeyReleasedEvent !== undefined) {
               onKeyReleasedEvent(self, event);
               return;
            }

            if (event === Gdk.KEY_Escape) {
               self.hide();
            }
         },

         onDestroy: (self) => {
            if (onDestroyed !== undefined) {
               onDestroyed(self);
            }
         },

         setup: (self) => {
            if (setup !== undefined) {
               setup(self);
            }
         },
      },

      widget
   );

   if (clickThroughFiller !== undefined && clickThroughFiller) {
      matchInputRegionOfWidget(window, child);

      let intervalId: AstalIO.Time | null = null;

      hook(window, window, "notify::visible", () => {
         if (window.visible) {
            intervalId = interval(1000, () => {
               matchInputRegionOfWidget(window, child);
            });
         } else {
            intervalId?.cancel();
         }
      });
   }

   return window;
}
