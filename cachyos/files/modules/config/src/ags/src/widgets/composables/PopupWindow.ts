import { App, Astal, Gdk, Gtk, hook, Widget } from "astal/gtk4";
import options from "../../options";
import { AstalIO, interval } from "astal";
import { matchInputRegionOfWidget as makeClickThroughWindowWithExceptions } from "../../utils/widget";

type FillerProps = {
   cssClasses?: string[];
   hexpand?: boolean;
   vexpand?: boolean;
   widthRequest?: number;
   heightRequest?: number;
   onClicked?: () => void;
};

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
      if (!cssClasses) return defaultCssClasses;
      return [...defaultCssClasses, ...cssClasses];
   }

   return Widget.Button({
      cssClasses: setupClassName(),
      widthRequest,
      heightRequest,
      hexpand,
      vexpand,
      canFocus: false,
      onClicked: onClicked,
   });
}

export enum Position {
   TOP_CENTER,
   TOP_RIGHT,
   CENTER,
}

type PopupWindowProps = {
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
};

// This implementation fixes label wrapping.
export default function (
   popupWindowProps: PopupWindowProps,
   child: Gtk.Widget
): Astal.Window {
   const {
      gdkmonitor,
      name,
      cssClasses: cssClasses,
      exclusivity,
      layer,
      keymode,
      position,
      clickThroughFiller,
      onFillerClicked,
      onKeyReleasedEvent,
      onDestroyed,
   } = popupWindowProps;

   const curatedCallback = () => {
      if (onFillerClicked) {
         onFillerClicked();
         return;
      }

      App.get_window(name)?.hide();
   };

   let anchor: Astal.WindowAnchor | undefined;
   let widget: Gtk.Widget | undefined;

   if (position === Position.TOP_CENTER) {
      anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM;

      widget = Widget.Box(
         {
            hexpand: false,
            vexpand: false,
         },

         Filler({
            widthRequest: options.filler.width,
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         }),

         Widget.Box(
            {
               vertical: true,
               hexpand: false,
               vexpand: false,
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
            widthRequest: options.filler.width,
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         })
      );
   } else if (position === Position.CENTER) {
      anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM;

      widget = Widget.Box(
         {
            hexpand: false,
            vexpand: false,
         },

         Filler({
            widthRequest: options.filler.width,
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         }),

         Widget.Box(
            {
               vertical: true,
               hexpand: false,
               vexpand: false,
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
            widthRequest: options.filler.width,
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         })
      );
   } else if (position === Position.TOP_RIGHT) {
      anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT;

      widget = Widget.Box(
         {
            hexpand: false,
            vexpand: false,
         },

         Filler({
            widthRequest: options.filler.width,
            hexpand: true,
            vexpand: true,
            onClicked: curatedCallback,
         }),

         Widget.Box(
            {
               vertical: true,
               hexpand: false,
               vexpand: false,
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
               heightRequest: options.filler.height,
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
         gdkmonitor: gdkmonitor,
         name: name,
         namespace: name,
         cssClasses: cssClasses,
         visible: false,

         exclusivity: exclusivity ?? Astal.Exclusivity.IGNORE,
         layer: layer ?? Astal.Layer.TOP,
         keymode: keymode ?? Astal.Keymode.EXCLUSIVE,
         anchor: anchor,

         onKeyReleased: (self, event) => {
            if (onKeyReleasedEvent) {
               onKeyReleasedEvent(self, event);
               return;
            }

            if (event === Gdk.KEY_Escape) {
               self.hide();
            }
         },

         onDestroy: (self) => {
            if (onDestroyed) {
               onDestroyed(self);
            }
         },
      },

      widget
   );

   if (clickThroughFiller) {
      makeClickThroughWindowWithExceptions(window, child);

      let intervalId: AstalIO.Time | undefined;

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
