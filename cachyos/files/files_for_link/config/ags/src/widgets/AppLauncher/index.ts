import { execAsync, timeout, Variable } from "astal";
import { bind } from "astal/binding";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import options from "../../options";
import Pango from "gi://Pango?version=1.0";
import AppMap from "./AppMap";

const apps = new Apps.Apps();

function hide() {
   App.get_window("astal-app-launcher")?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const appMap = new AppMap();

   const entry = new Widget.Entry({
      placeholderText: "Search",
      text: bind(appMap.searchQuery),
      onChanged: (self) => appMap.searchQuery.set(self.text),

      onActivate: () => {
         const currentSearchQuery = appMap.searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            execAsync(["fish", "-c", `${currentSearchQuery.slice(3)}`.trim()]);
         } else {
            appMap.launchApp();
         }

         hide();
         appMap.searchQuery.set("");
      },
   });

   const appsBox = new Widget.Box({
      className: "apps-container",
      vertical: true,

      setup: (self) => {
         self.children = appMap.get();

         appMap.subscribe((list) => {
            self.children = list;
         });
      },

      onDestroy: () => {
         appMap.destroy();
      },
   });

   const shBox = new Widget.Box({
      children: [new Widget.Label({ label: "shbox mode! :3" })],
   });

   const emptyBox = new Widget.Box({
      children: [new Widget.Label({ label: "empty..." })],
   });

   // to avoid problems with entry
   const hotswapBox = new Widget.Box({
      className: "hotswap-box",
   });

   const mainBox = new Widget.Box({
      className: "main-box",
      vertical: true,
      hexpand: false,
      children: [entry, hotswapBox],
   });

   const window = new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-app-launcher",
      className: "app-launcher",
      exclusivity: Astal.Exclusivity.IGNORE,
      keymode: Astal.Keymode.EXCLUSIVE,
      layer: Astal.Layer.OVERLAY,
      anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM,
      visible: false,

      onKeyReleaseEvent: (self, event) => {
         if (event.get_keyval()[1] === Gdk.KEY_Escape) {
            self.hide();
            appMap.searchQuery.set("");
         }
      },

      child: new Widget.Box({
         className: "horizontal-filler-box",

         children: [
            new Widget.EventBox({
               expand: true,
               // needs to be implemented this way
               // using an absurdly huge number allows
               // the main content to be coherent
               // so horizontally it's a fixed size
               widthRequest: 4000,
               onClick: () => hide(),
            }),

            new Widget.Box({
               className: "vertical-filler-box",
               vertical: true,

               children: [
                  // so min-height does not work
                  // with eventbox
                  new Widget.EventBox({
                     heightRequest: 200,
                     onClick: () => hide(),
                  }),

                  mainBox,

                  new Widget.EventBox({
                     expand: true,
                     onClick: () => hide(),
                  }),
               ],
            }),

            new Widget.EventBox({
               expand: true,
               widthRequest: 4000,
               onClick: () => hide(),
            }),
         ],
      }),
   });

   function onSearchQueryChanged(searchQuery: string) {
      if (searchQuery === "") {
         hotswapBox.children = [emptyBox];
      } else if (searchQuery.startsWith(":sh")) {
         hotswapBox.children = [shBox];
      } else {
         function onClick() {
            appMap.launchApp();
            hide();
            appMap.searchQuery.set("");
         }

         if (hotswapBox.children[0] !== appsBox) {
            hotswapBox.children = [appsBox];
            console.log("initial");
            appMap.update(() => onClick(), true);
         } else {
            hotswapBox.children = [appsBox];
            console.log("not initial");
            appMap.update(() => onClick(), false);
         }
      }
   }

   onSearchQueryChanged(appMap.searchQuery.get());

   appMap.searchQuery.subscribe((searchQuery) => {
      onSearchQueryChanged(searchQuery);
   });

   return window;
}
