import { Gtk, Widget } from "astal/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import { IconWithLabelFallback } from "../../../wrappers/IconWithLabelFallback";
import icons from "../../../../libs/icons";

export class ClientMap implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      const hyprland = AstalHyprland.get_default();

      hyprland.clients.forEach((client) => {
         this.set(client.get_address(), wrapper(client, hyprland));
      });

      hyprland.connect("client-added", (_, client) => {
         this.set(client.get_address(), wrapper(client, hyprland));
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
      this.notify();
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
   }
}

function wrapper(
   client: AstalHyprland.Client,
   hyprland: AstalHyprland.Hyprland
): Widget.Button {
   const widget = IconWithLabelFallback({
      icon: client.class,
      //fallbackIcon: icons.fallback.executable,

      iconProps: {
         setup: (self) => x(self),
      },

      labelProps: {
         setup: (self) => x(self),
      },
   });

   function x(self: Widget.Icon | Widget.Label) {
      onFocusedClientChanged();

      self.hook(hyprland, "notify::focused-client", () => {
         onFocusedClientChanged();
      });

      function onFocusedClientChanged() {
         self.toggleClassName(
            "active",
            hyprland.focusedClient &&
               hyprland.focusedClient.address === client.address
         );
      }
   }

   return new Widget.Button(
      {
         onClick: () => {
            hyprland.dispatch("focuswindow", `address:0x${client.address}`);
         },
      },

      widget
   );
}
