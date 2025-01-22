import { execAsync, Variable } from "astal";
import { App, Astal, Gdk, Widget } from "astal/gtk4";
import AppMap from "./AppMap";
import Apps from "gi://AstalApps";
import PopupWindow, { Position } from "../wrappers/PopupWindow";

function hide() {
   App.get_window("astal-app-launcher")?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const appMap = new AppMap();
   const selectedIndex: Variable<number | undefined> = Variable(undefined);

   const entry = Widget.Entry({
      placeholderText: "Search",
      text: appMap.searchQuery.get(),
      onChanged: (self) => appMap.searchQuery.set(self.text),

      onActivate: (self) => {
         const currentSearchQuery = appMap.searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            execAsync(["fish", "-c", `${currentSearchQuery.slice(3)}`.trim()]);
         } else {
            let selectedIndexValue = selectedIndex.get();
            if (!selectedIndexValue) selectedIndexValue = 0;
            appMap.launchApp(selectedIndexValue);
         }

         hide();
         appMap.searchQuery.set("");
         self.text = "";
         selectedIndex.set(undefined);
      },
   });

   const appsBox = Widget.Box({
      cssClasses: ["apps-box"],
      vertical: true,

      onDestroy: () => {
         appMap.destroy();
      },
   });

   const shBox = Widget.Box({
      children: [Widget.Label({ label: "shbox mode! :3" })],
   });

   const emptyBox = Widget.Box({
      children: [Widget.Label({ label: "empty..." })],
   });

   // to avoid problems with entry
   const hotswapBox = Widget.Box({
      cssClasses: ["hotswap-box"],
   });

   const mainBox = Widget.Box({
      cssClasses: ["main-box"],
      vertical: true,
      hexpand: false,
      children: [entry, hotswapBox],
   });

   const window = PopupWindow(
      {
         gdkmonitor: gdkmonitor,
         name: "astal-app-launcher",
         cssClasses: ["app-launcher"],
         exclusivity: Astal.Exclusivity.IGNORE,
         layer: Astal.Layer.OVERLAY,
         position: Position.TOP_CENTER,

         onKeyReleasedEvent: (self, event) => {
            if (event === Gdk.KEY_Escape) {
               self.hide();
               appMap.searchQuery.set("");
               entry.text = "";
               selectedIndex.set(undefined);
            }

            if (event === Gdk.KEY_Up) {
               const maxLength = appMap.length();
               let selectedIndexValue = selectedIndex.get();
               if (selectedIndexValue === undefined)
                  selectedIndexValue = maxLength - 1;

               if (selectedIndexValue > 0) {
                  selectedIndex.set(selectedIndexValue - 1);
               } else {
                  selectedIndex.set(0);
               }
            }

            if (event === Gdk.KEY_Down) {
               const maxLength = appMap.length();
               let selectedIndexValue = selectedIndex.get();
               if (selectedIndexValue === undefined) selectedIndexValue = -1;

               if (selectedIndexValue < maxLength - 1) {
                  selectedIndex.set(selectedIndexValue + 1);
               } else {
                  selectedIndex.set(maxLength - 1);
               }
            }
         },
      },

      mainBox
   );

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
         appMap.update(selectedIndex, (_, app) => onClicked(app));
         const appWidgets = appMap.get();
         appsBox.children = appWidgets;

         if (hotswapBox.children[0] !== appsBox) {
            hotswapBox.children = [appsBox];
         } else {
            hotswapBox.children = [appsBox];
         }
      }
   }

   onSearchQueryChanged(appMap.searchQuery.get());

   appMap.searchQuery.subscribe((searchQuery) => {
      onSearchQueryChanged(searchQuery);
   });

   return window;
}
