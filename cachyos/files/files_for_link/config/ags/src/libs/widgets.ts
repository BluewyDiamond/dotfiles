import { astalify, ConstructProps, Gtk } from "astal/gtk4";

export type GestureSingleProps = ConstructProps<
   Gtk.GestureClick,
   Gtk.GestureClick.ConstructorProps
>;

export const GestureSingle = astalify<
   Gtk.GestureSingle,
   Gtk.GestureSingle.ConstructorProps
>(Gtk.GestureSingle, {
   // Placeholder for any specific methods if necessary

});
