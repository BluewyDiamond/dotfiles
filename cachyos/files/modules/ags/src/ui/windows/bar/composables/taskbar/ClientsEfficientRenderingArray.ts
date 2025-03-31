import { type Gtk, hook, Widget } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland";
import type { Subscribable } from "astal/binding";
import { IconWithLabelFallback } from "../../../../composables/IconWithLabelFallback";
import icons, { createIcon } from "../../../../../libs/icons";
import Trackable from "../../../../../libs/Trackable";
import { EfficientRenderingArray } from "../../../../../libs/efficientRendering";

const hyprland = AstalHyprland.get_default();

function ClientButton(client: AstalHyprland.Client): Gtk.Button {
   return Widget.Button(
      {
         cssClasses: ["bar-item"],

         onClicked: () => {
            hyprland.dispatch("focuswindow", `address:0x${client.address}`);
         },

         setup: (self) => {
            hook(
               self,
               hyprland,
               "urgent",

               (_, urgentClient: AstalHyprland.Client | null) => {
                  if (urgentClient === null) return;

                  if (urgentClient.address === client.address) {
                     self.cssClasses = [...self.cssClasses, "urgent"];
                  }
               }
            );

            hook(self, hyprland, "notify::focused-client", () => {
               const focusedClient =
                  hyprland.focusedClient as AstalHyprland.Client | null;

               if (focusedClient === null) return;

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
         icon: createIcon({normal: client.class}),
         fallbackIcon: icons.fallback.executable,
      })
   );
}

export class ClientsEfficientRenderingArray
   extends EfficientRenderingArray<string, Gtk.Widget, Gtk.Widget>
   implements Subscribable
{
   private readonly trackable = new Trackable();

   constructor() {
      super();
      this.init();
   }

   destroy(): void {
      this.trackable.destroy();
   }

   protected notify(): void {
      this.variable.set([...this.array.map((item) => item.value)]);
   }

   private add(client: AstalHyprland.Client): void {
      const index = this.array.findIndex((item) => {
         const predicateClient = hyprland.get_client(item.key);
         if (predicateClient == null) return false;
         return client.workspace.id < predicateClient.workspace.id;
      });

      const widget = ClientButton(client);

      if (index === -1) {
         this.array.push({ key: client.address, value: widget });
      } else {
         this.array.splice(index, 0, {
            key: client.address,
            value: widget,
         });
      }
   }

   private remove(address: string): void {
      const index = this.array.findIndex((item) => item.key === address);

      if (index === -1) {
         print("Client to be removed is not present in the array.");
      }

      this.array.splice(index, 1);
   }

   private move(client: AstalHyprland.Client): void {
      this.remove(client.address);
      this.add(client);
   }

   private init(): void {
      hyprland.clients.forEach((client) => {
         this.add(client);
         this.notify();
      });

      this.trackable.track([
         hyprland.connect(
            "client-added",
            (_, client: AstalHyprland.Client | null) => {
               if (client === null) {
                  return;
               }

               this.add(client);
               this.notify();
            }
         ),

         hyprland,
      ]);

      this.trackable.track([
         hyprland.connect("client-removed", (_, address: string) => {
            this.remove(address);
            this.notify();
         }),

         hyprland,
      ]);

      this.trackable.track([
         hyprland.connect("client-moved", (_, client: AstalHyprland.Client) => {
            this.move(client);
            this.notify();
         }),

         hyprland,
      ]);
   }
}
