import { execAsync, timeout, Variable } from "astal";
import { bind } from "astal/binding";
import { App, Astal, Gdk, Widget } from "astal/gtk3";
import AppMap from "./AppMap";
import Apps from "gi://AstalApps";

function hide() {
   App.get_window("astal-app-launcher")?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const appMap = new AppMap();
   const selectedIndex = Variable(0);

   const entry = new Widget.Entry({
      placeholderText: "Search",
      text: bind(appMap.searchQuery),
      onChanged: (self) => appMap.searchQuery.set(self.text),

      onActivate: () => {
         const currentSearchQuery = appMap.searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            execAsync(["fish", "-c", `${currentSearchQuery.slice(3)}`.trim()]);
         } else {
            appMap.launchApp(selectedIndex.get());
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

            // fixes hover state never being cleared
            // when dynamically moving widgets around
            //timeout(1, () => {
            list.forEach((widget) => {
               if (widget instanceof Widget.Button) {
                  widget.vfunc_leave();
               }
               //});
            });
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

         if (event.get_keyval()[1] === Gdk.KEY_Up) {
            const selectedIndexValue = selectedIndex.get();

            if (selectedIndexValue > 0) {
               selectedIndex.set(selectedIndexValue - 1);
            } else {
               selectedIndex.set(0);
            }
         }

         if (event.get_keyval()[1] === Gdk.KEY_Down) {
            const selectedIndexValue = selectedIndex.get();
            const maxLength = appMap.length();

            if (selectedIndexValue < maxLength - 1) {
               selectedIndex.set(selectedIndexValue + 1);
            } else {
               selectedIndex.set(maxLength - 1);
            }
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
      function onClicked(app: Apps.Application) {
         app.launch();
         hide();
         appMap.searchQuery.set("");
      }

      if (searchQuery === "") {
         hotswapBox.children = [emptyBox];
         appMap.clear();
      } else if (searchQuery.startsWith(":sh")) {
         hotswapBox.children = [shBox];
         appMap.clear();
      } else {
         if (hotswapBox.children[0] !== appsBox) {
            appMap.update(selectedIndex, (_, app) => onClicked(app));

            timeout(1, () => {
               appsBox.queue_resize();
            });
         } else {
            appMap.update(selectedIndex, (_, app) => onClicked(app));
         }

         hotswapBox.children = [appsBox];
      }
   }

   onSearchQueryChanged(appMap.searchQuery.get());

   appMap.searchQuery.subscribe((searchQuery) => {
      onSearchQueryChanged(searchQuery);
   });

   return window;
}
