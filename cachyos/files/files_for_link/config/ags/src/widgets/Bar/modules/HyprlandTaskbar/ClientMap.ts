import { Gtk, hook, Widget } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import { IconWithLabelFallback } from "../../../wrappers/IconWithLabelFallback";
import icons from "../../../../icons";
import Hookable from "../../../../libs/services/Hookable";

const hyprland = AstalHyprland.get_default();

function ClientWidget(
   client: AstalHyprland.Client,
   hyprland: AstalHyprland.Hyprland
): Gtk.Button {
   return Widget.Button(
      {
         onClicked: () => {
            hyprland.dispatch("focuswindow", `address:0x${client.address}`);
         },

         setup: (self) => {
            hook(
               self,
               hyprland,
               "urgent",

               (_, urgentClient: AstalHyprland.Client) => {
                  if (!urgentClient) return;

                  if (urgentClient.address === client.address) {
                     self.cssClasses = [...self.cssClasses, "urgent"];
                  }
               }
            );

            hook(self, hyprland, "notify::focused-client", () => {
               const focusedClient = hyprland.focusedClient;
               if (!focusedClient) return;

               if (focusedClient.address === client.address) {
                  self.cssClasses = self.cssClasses.filter(
                     (cssClass) => cssClass !== "urgent"
                  );

                  self.cssClasses = [...self.cssClasses, "active"];
               } else {
                  self.cssClasses = self.cssClasses.filter(
                     (cssClass) => cssClass !== "active"
                  );
               }
            });
         },
      },

      IconWithLabelFallback({
         iconName: client.class,
         fallbackIcon: icons.fallback.executable,
      })
   );
}

export class ClientMap extends Hookable implements Subscribable {
   private map: Map<string, Gtk.Widget> = new Map();
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      super();

      hyprland.clients.forEach((client) => {
         this.set(client.get_address(), ClientWidget(client, hyprland));
      });

      this.sort();
      this.notify();

      this.hook(hyprland, "client-added", (_, client) => {
         this.set(client.get_address(), ClientWidget(client, hyprland));
         this.sort();
         this.notify();
      });

      this.hook(hyprland, "client-removed", (_, address) => {
         this.delete(address);
         this.notify();
      });

      this.hook(hyprland, "client-moved", () => {
         this.sort();
         this.notify();
      });
   }

   get(): Gtk.Widget[] {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void): () => void {
      return this.var.subscribe(callback);
   }

   destroy() {
      super.destroy();
      this.var.drop();
   }

   private set(key: string, value: Gtk.Widget) {
      //this.map.get(key)?.unparent();
      this.map.set(key, value);
   }

   private delete(key: string) {
      //this.map.get(key)?.unparent(); // maybe uneeded
      this.map.delete(key);
   }

   private notify() {
      this.var.set([...this.map.values()]);
   }

   private sort() {
      const sortedEntries = [...this.map.entries()].sort((a, b) => {
         const clientA = hyprland.get_client(a[0]);
         const clientB = hyprland.get_client(b[0]);

         if (!clientA || !clientB) {
            return 0;
         }

         return clientA.workspace.id - clientB.workspace.id;
      });

      this.map.clear();

      sortedEntries.forEach(([key, value]) => {
         this.map.set(key, value);
      });
   }
}
