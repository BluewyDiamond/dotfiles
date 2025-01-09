import { Gtk, Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import { IconWithLabelFallback } from "../../../wrappers/IconWithLabelFallback";
import icons from "../../../../libs/icons";

const hyprland = AstalHyprland.get_default();

function ClientWidget(
   client: AstalHyprland.Client,
   hyprland: AstalHyprland.Hyprland
): Widget.Button {
   return new Widget.Button(
      {
         onClick: () => {
            hyprland.dispatch("focuswindow", `address:0x${client.address}`);
         },

         setup: (self) => {
            function onFocusedClientChanged() {
               self.toggleClassName(
                  "active",
                  hyprland.focusedClient &&
                     hyprland.focusedClient.address === client.address
               );
            }

            onFocusedClientChanged();

            self.hook(hyprland, "notify::focused-client", () => {
               onFocusedClientChanged();
            });
         },
      },

      IconWithLabelFallback({
         icon: client.class,
         fallbackIcon: icons.fallback.executable,
      })
   );
}

export class ClientMap implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      hyprland.clients.forEach((client) => {
         this.set(client.get_address(), ClientWidget(client, hyprland));
      });

      hyprland.connect("client-added", (_, client) => {
         this.set(client.get_address(), ClientWidget(client, hyprland));
      });

      hyprland.connect("client-removed", (_, address) => {
         this.delete(address);
      });
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
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
      this.notify();
   }

   private notify() {
      this.var.set([...this.map.values()]);
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
}
