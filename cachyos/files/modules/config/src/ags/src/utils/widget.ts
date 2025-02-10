import { App, Gtk, hook, Widget } from "astal/gtk4";
import cairo from "gi://cairo";

export function paginateBoxes(
   rows: number,
   columns: number,
   widgets: Gtk.Widget[]
): Gtk.Box[] {
   const pageSize = rows * columns;
   const pages: Gtk.Box[] = [];

   for (
      let widgetCount = 0;
      widgetCount < widgets.length;
      widgetCount += pageSize
   ) {
      const page = Widget.Box({ vertical: true });
      const chunk = widgets.slice(widgetCount, widgetCount + pageSize);

      for (let rowCount = 0; rowCount < rows; rowCount++) {
         const start = rowCount * columns;
         const end = start + columns;
         const rowArray = chunk.slice(start, end);
         const rowBox = Widget.Box({});

         for (const widget of rowArray) {
            rowBox.append(widget);
         }

         page.append(rowBox);
      }

      pages.push(page);
   }

   return pages;
}

export function onWindowVisible(windowName: string, widget: Gtk.Widget): void {
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
): void {
   const windowGdkNative = window.get_native();
   if (windowGdkNative === null) return;

   const windowGdkSurface = windowGdkNative.get_surface();
   if (windowGdkSurface === null) return;

   const translatedCoordinates = widget.translate_coordinates(window, 0, 0);

   const rectangleInt = new cairo.RectangleInt({
      x: translatedCoordinates[1],
      y: translatedCoordinates[2],
      width: widget.get_width(),
      height: widget.get_height(),
   });

   const cairoRegion = new cairo.Region();

   // @ts-expect-error
   cairoRegion.unionRectangle(rectangleInt);

   windowGdkSurface.set_input_region(cairoRegion);
}
