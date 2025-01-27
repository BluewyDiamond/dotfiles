import { Gtk, hook, Widget } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland";
import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import { IconWithLabelFallback } from "../../../wrappers/IconWithLabelFallback";
import icons from "../../../../icons";
import Hookable from "../../../../libs/services/Hookable";

const hyprland = AstalHyprland.get_default();

function ClientButton(client: AstalHyprland.Client): Gtk.Button {
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
   // have to sort, so using a map might not be optimal
   private arr: Array<{ adress: string; widget: Gtk.Widget }> = [];
   private var: Variable<Array<Gtk.Widget>> = Variable([]);

   constructor() {
      super();

      hyprland.clients.forEach((client) => {
         this.add(client);
         this.notify();
      });

      this.hook(hyprland, "client-added", (_, client: AstalHyprland.Client) => {
         this.add(client);
         this.notify();
      });

      this.hook(hyprland, "client-removed", (_, address: string) => {
         this.remove(address);
         this.notify();
      });

      this.hook(hyprland, "client-moved", (_, client: AstalHyprland.Client) => {
         this.move(client);
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

   private notify() {
      this.var.set([...this.arr.map((item) => item.widget)]);
   }

   private add(client: AstalHyprland.Client) {
      const index = this.arr.findIndex((item) => {
         const predicateClient = hyprland.get_client(item.adress);
         if (!predicateClient) return false;

         return client.workspace.id < predicateClient.workspace.id;
      });

      const widget = ClientButton(client);

      if (index === -1) {
         this.arr.push({ adress: client.address, widget: widget });
      } else {
         this.arr.splice(index, 0, {
            adress: client.address,
            widget: widget,
         });
      }
   }

   private remove(address: string) {
      const index = this.arr.findIndex((item) => item.adress === address);

      if (index === -1) {
         console.error("Client to be removed is not present in the array.");
      }

      this.arr.splice(index, 1);
   }

   private move(client: AstalHyprland.Client) {
      this.remove(client.address);
      this.add(client);
   }
}
