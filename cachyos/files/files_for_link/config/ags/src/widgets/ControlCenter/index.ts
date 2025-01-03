import { Variable } from "astal";
import { Subscribable } from "astal/binding";
import { Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "../wrappers/Notification";

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const notificationMap = new NotificationMap();

   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-control-center",
      className: "control-center",
      exclusivity: Astal.Exclusivity.NORMAL,
      layer: Astal.Layer.TOP,
      anchor: Astal.WindowAnchor.TOP,
      visible: false,
      child: new Widget.Box({}),
   });
}

class NotificationMap implements Subscribable {
   private map: Map<number, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      const notifd = Notifd.get_default();

      notifd.notifications.forEach((notification) => {
         this.set(
            notification.id,
            Notification(notifd.get_notification(notification.id))
         );
      });

      notifd.connect("notified", (_, id) => {
         this.set(id, Notification(notifd.get_notification(id)));
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
