import { App, Gtk, hook } from "astal/gtk4";
import cairo from "gi://cairo";

export function onWindowVisible(windowName: string, widget: Gtk.Widget) {
   let open = false;

   hook(widget, App, "window-toggled", (_, window: Gtk.Window) => {
      if (window.name !== windowName) return;

      if (open && !window.visible) {
         open = false;

         widget.cssClasses = widget.cssClasses.filter(
            (cssClass) => cssClass !== "active"
         );
      }

      if (window.visible) {
         open = true;
         widget.cssClasses = [...widget.cssClasses, "active"];
      }
   });
}

export function matchInputRegionOfWidget(
   window: Gtk.Window,
   widget: Gtk.Widget
) {
   const windowGdkNative = window.get_native();
   if (!windowGdkNative) return;

   const windowGdkSurface = windowGdkNative.get_surface();
   if (!windowGdkSurface) return;

   const translatedCoordinates = widget.translate_coordinates(window, 0, 0);

   const rectangleInt = new cairo.RectangleInt({
      x: translatedCoordinates[1],
      y: translatedCoordinates[2],
      width: widget.get_width(),
      height: widget.get_height(),
   });

   const cairoRegion = new cairo.Region();

   // @ts-ignore
   cairoRegion.unionRectangle(rectangleInt);

   windowGdkSurface.set_input_region(cairoRegion);
}
