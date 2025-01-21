import { App, Astal, Gtk, hook } from "astal/gtk4";

export function setupAsPanelButton(button: Gtk.Button, windowName: string) {
   let open = false;

   hook(button, App, "window-toggled", (_, window: Gtk.Window) => {
      if (window.name !== windowName) return;

      if (open && !window.visible) {
         open = false;

         button.cssClasses = button.cssClasses.filter(
            (cssClass) => cssClass !== "active"
         );
      }

      if (window.visible) {
         open = true;
         button.cssClasses = [...button.cssClasses, "active"];
      }
   });
}
