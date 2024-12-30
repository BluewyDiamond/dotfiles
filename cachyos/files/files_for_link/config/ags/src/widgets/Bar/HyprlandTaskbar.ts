import { Gtk, Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import { IconWithLabelFallback } from "../wrappers";

export default function (): Widget.Box {
   const clientMap = new ClientMap();

   return new Widget.Box({
      className: "hyprland-taskbar",

      setup: (self) => {
         self.children = clientMap.get();

         clientMap.subscribe((list) => {
            self.children = list;
         });
      },
   });
}

class ClientMap implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      const hyprland = AstalHyprland.get_default();

      hyprland.clients.forEach((client) => {
         this.set(
            client.get_address(),
            IconWithLabelFallback(client.get_class(), {})
         );
      });

      hyprland.connect("client-added", (_, client) => {
         this.set(
            client.get_address(),
            IconWithLabelFallback(client.get_class(), {})
         );
      });

      hyprland.connect("client-removed", (_, address) => {
         this.delete(address);
      });
   }

   private sort() {
      const hyprland = AstalHyprland.get_default();

      const arr = Array.from(this.map);

      // TODO: handle the null case
      arr.sort((a, b) => {
         const clientA = hyprland.get_client(a[0])!;
         const clientB = hyprland.get_client(b[0])!;

         return clientA.workspace.id - clientB.workspace.id;
      });

      this.map = new Map(arr);
   }

   private notify() {
      this.var.set([...this.map.values()]);
   }

   private set(key: string, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.sort();
      this.notify();
   }

   private delete(key: string) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.sort();
      this.notify();
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
   }
}
