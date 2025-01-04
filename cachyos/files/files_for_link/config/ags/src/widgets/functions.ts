import { App, Gtk, Widget } from "astal/gtk3";

export function setupAsPanelButton(button: Widget.Button, windowName: string) {
   let open = false;

   button.hook(App, "window-toggled", (_, window: Gtk.Window) => {
      if (window.name !== windowName) return;

      if (open && !window.visible) {
         open = false;
         button.toggleClassName("active", false);
      }

      if (window.visible) {
         open = true;
         button.toggleClassName("active", true);
      }
   });
}
