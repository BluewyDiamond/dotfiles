import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import options from "../../options";

type FillerProps = {
   widthRequest?: number;
   heightRequest?: number;
   hexpand?: boolean;
   vexpand?: boolean;
   expand?: boolean;
   onClicked?: () => void;
};

function Filler(fillerProps: FillerProps): Widget.EventBox {
   const { widthRequest, heightRequest, hexpand, vexpand, expand, onClicked } =
      fillerProps;

   return new Widget.EventBox({
      widthRequest,
      heightRequest,
      hexpand,
      vexpand,
      expand,
      canFocus: false,
      onClick: onClicked,
   });
}

export enum LayoutPosition {
   TOP_CENTER,
   CENTER,
}

type PopupWindowProps = {
   gdkmonitor?: Gdk.Monitor;
   name: string;
   className?: string;
   exclusivity?: Astal.Exclusivity;
   layer?: Astal.Layer;
   keymode: Astal.Keymode;
   position: LayoutPosition;
   onFillerClicked?: () => void;
   onKeyReleasedEvent?: (self: Gtk.Widget, event: Gdk.Event) => void;
};

// This implementation fixes label wrapping.
export default function (
   popupWindowProps: PopupWindowProps,
   child: Gtk.Widget
): Widget.Window {
   const {
      gdkmonitor,
      name,
      className,
      exclusivity,
      layer,
      keymode,
      position,
      onFillerClicked,
      onKeyReleasedEvent: onKeyReleaseEvent,
   } = popupWindowProps;

   const curatedCallback = () => {
      if (onFillerClicked) {
         onFillerClicked();
         return;
      }

      App.get_window(name)?.hide();
   };

   let anchor: Astal.WindowAnchor;
   let widget: Gtk.Widget;

   if (position === LayoutPosition.TOP_CENTER) {
      anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM;

      widget = new Widget.Box(
         {},

         Filler({
            widthRequest: options.filler.width,
            expand: true,
            onClicked: curatedCallback,
         }),

         new Widget.Box(
            { vertical: true },

            Filler({
               heightRequest: 200,
               onClicked: curatedCallback,
            }),

            child,

            Filler({
               onClicked: curatedCallback,
            })
         ),

         Filler({
            widthRequest: options.filler.width,
            expand: true,
            onClicked: curatedCallback,
         })
      );
   } else if (position === LayoutPosition.CENTER) {
      anchor =
         Astal.WindowAnchor.TOP |
         Astal.WindowAnchor.BOTTOM;

      widget = new Widget.Box(
         {},

         Filler({
            widthRequest: options.filler.width,
            expand: true,
            onClicked: curatedCallback,
         }),

         new Widget.Box(
            { vertical: true },

            Filler({ expand: true, onClicked: curatedCallback }),
            child,
            Filler({ expand: true, onClicked: curatedCallback })
         ),

         Filler({
            widthRequest: options.filler.width,
            expand: true,
            onClicked: curatedCallback,
         })
      );
   }

   return new Widget.Window(
      {
         gdkmonitor: gdkmonitor,
         name: name,
         namespace: name,
         className: className,
         visible: false,

         exclusivity: exclusivity,
         layer: layer,
         keymode: keymode,
         anchor: anchor,

         onKeyReleaseEvent: (self, event) => {
            if (onKeyReleaseEvent) {
               onKeyReleaseEvent(self, event);
               return;
            }

            if (event.get_keyval()[1] === Gdk.KEY_Escape) {
               self.hide();
            }
         },
      },

      widget
   );
}
