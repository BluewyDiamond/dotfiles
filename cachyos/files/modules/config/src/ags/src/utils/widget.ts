import { App, Gtk, hook } from "astal/gtk4";

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
