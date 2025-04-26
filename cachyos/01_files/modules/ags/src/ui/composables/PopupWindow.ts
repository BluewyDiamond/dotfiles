import { App, Astal, Gdk, type Gtk, hook, Widget } from "astal/gtk4";
import { type AstalIO, interval } from "astal";
import { matchInputRegionOfWidget as makeClickThroughWindowWithExceptions } from "../../utils/widget";

interface FillerProps {
   cssClasses?: string[];
   hexpand?: boolean;
   vexpand?: boolean;
   widthRequest?: number;
   heightRequest?: number;
   onClicked?: () => void;
}

function Filler(fillerProps: FillerProps): Gtk.Button {
   const {
      cssClasses,
      hexpand,
      vexpand,
      widthRequest,
      heightRequest,
      onClicked,
   } = fillerProps;

   function setupClassName(): string[] {
      const defaultCssClasses = ["filler-button"];
      if (cssClasses === undefined) return defaultCssClasses;
      return [...defaultCssClasses, ...cssClasses];
   }

   return Widget.Button({
      cssClasses: setupClassName(),
      widthRequest,
      heightRequest,
      hexpand,
      vexpand,
      canFocus: false,
      onClicked,
   });
}

export enum Position {
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

// This implementation no longer fixes label wrapping.
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

   let anchor: Astal.WindowAnchor | null = null;
   let widget: Gtk.Widget | null = null;

   if (position === Position.TOP_CENTER) {
      anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM;

      widget = Widget.Box(
         {},

         Filler({
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         }),

         Widget.Box(
            {
               vertical: true,
            },

            Widget.Button({
               cssClasses: ["top-offset"],
               canFocus: false,
               onClicked: curatedCallback,
            }),

            child,

            Filler({
               onClicked: curatedCallback,
               hexpand: true,
               vexpand: true,
            })
         ),

         Filler({
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         })
      );
   } else if (position === Position.CENTER) {
      anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM;

      widget = Widget.Box(
         {},

         Filler({
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         }),

         Widget.Box(
            {
               vertical: true,
            },

            Filler({
               hexpand: true,
               vexpand: true,
               onClicked: curatedCallback,
            }),

            child,

            Filler({
               hexpand: true,
               vexpand: true,
               onClicked: curatedCallback,
            })
         ),

         Filler({
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         })
      );
   } else if (position === Position.TOP_RIGHT) {
      // important: it must always anchor to top and bottom for it to work properly
      anchor =
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.BOTTOM |
         Astal.WindowAnchor.RIGHT;

      widget = Widget.Box(
         {},

         Filler({
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         }),

         Widget.Box(
            {
               vertical: true,
            },

            Filler({
               cssClasses: ["top-offset"],
               hexpand: true,
               onClicked: curatedCallback,
            }),

            child,

            Filler({
               hexpand: true,
               vexpand: true,
               onClicked: curatedCallback,
            })
         ),

         Filler({
            cssClasses: ["right-offset"],
            vexpand: true,
            onClicked: curatedCallback,
         })
      );
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
         anchor: anchor ?? undefined,

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
      makeClickThroughWindowWithExceptions(window, child);

      let intervalId: AstalIO.Time | null = null;

      hook(window, window, "notify::visible", () => {
         if (window.visible) {
            intervalId = interval(1000, () => {
               makeClickThroughWindowWithExceptions(window, child);
            });
         } else {
            intervalId?.cancel();
         }
      });
   }

   return window;
}
