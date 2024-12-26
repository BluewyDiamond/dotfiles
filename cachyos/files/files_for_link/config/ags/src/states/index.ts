import { Astal, Gtk, Gdk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import { type Subscribable } from "astal/binding";
import { Variable, bind, timeout } from "astal";

export class NotificationWidgets implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      const notifd = Notifd.get_default();

      notifd.connect("notified", (_, id) => {
         this.set(id, new Widget.Label({}));
      });

      notifd.connect("resolved", (_, id) => {
         this.delete(id);
      });
   }

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
   }

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }

   private set(key: number, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: number) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }
}
