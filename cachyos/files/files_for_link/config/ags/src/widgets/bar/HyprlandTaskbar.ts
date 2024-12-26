import { Gtk, Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { curateIcon } from "../../utils";
import { Subscribable } from "astal/binding";
import { Variable, bind, timeout } from "astal";

export default function (): Widget.Box {
   const clientsWidget = new ClientsWidget();

   return new Widget.Box({
      className: "hyprland-taskbar",
      children: bind(clientsWidget),
   });
}

function sortClients(clients: AstalHyprland.Client[]): AstalHyprland.Client[] {
   const sortedClients = clients.sort((i, j) => {
      return i.workspace.get_id() - j.workspace.get_id();
   });

   return sortedClients;
}

class ClientsWidget implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   private notify() {
      this.var.set([...this.map.values()].reverse());
   }

   private set(key: string, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: string) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
   }

   constructor() {
      const hyprland = AstalHyprland.get_default();

      hyprland.clients.forEach((client) => {
         this.set(
            client.get_address(),
            IconWithLabelFallback(client.get_class())
         );
      });

      //timeout(5000, () => {
      //   console.log("dropping 0");
      //   this.map.get(hyprland.clients[0].get_address())?.destroy();
      //   this.map.delete(hyprland.clients[0].get_address());
      //   //this.notify()
      //});

      hyprland.connect("client-added", (_, client) => {
         this.set(
            client.get_address(),
            IconWithLabelFallback(client.get_class())
         );
      });

      hyprland.connect("client-removed", (_, address) => {
         this.delete(address);
      });
   }
}

function IconWithLabelFallback(value: string): Widget.Icon | Widget.Label {
   let curatedIcon = curateIcon(value);

   if (curatedIcon === "") {
      return new Widget.Label({
         label: "?",
      });
   } else {
      return new Widget.Icon({
         icon: curatedIcon,
      });
   }
}
