import { execAsync } from "astal";
import { App, Astal, Gdk, Widget } from "astal/gtk4";
import AppMap from "./AppMap";
import PopupWindow, { Position } from "../composables/PopupWindow";
import options from "../../options";

function hide(): void {
   App.get_window(options.appLauncher.name)?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   const appMap = new AppMap(() => {
      hide();
   });

   const entry = Widget.Entry({
      placeholderText: "Search",
      text: appMap.searchQuery.get(),
      onChanged: (self) => {
         appMap.searchQuery.set(self.text);
      },

      onActivate: (self) => {
         const currentSearchQuery = appMap.searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            void execAsync(["fish", "-c", currentSearchQuery.slice(3).trim()]);
         } else {
            let selectedIndexValue = appMap.selectedIndex.get();
            if (selectedIndexValue === null) selectedIndexValue = 0;
            appMap.launchApp(selectedIndexValue);
         }

         hide();
         appMap.searchQuery.set("");
         self.text = "";
         appMap.selectedIndex.set(null);
      },
   });

   const appsBox = Widget.Box({
      cssClasses: ["apps-box"],
      vertical: true,

      setup: (self) => {
         self.children = appMap.get();
         appMap.subscribe((widgets) => (self.children = widgets));
      },

      onDestroy: () => {
         appMap.destroy();
      },
   });

   const shBox = Widget.Box({
      cssClasses: ["sh-box"],
      children: [Widget.Label({ label: "shbox mode! :3" })],
   });

   const emptyBox = Widget.Box({
      cssClasses: ["empty-box"],
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
         gdkmonitor,
         name: options.appLauncher.name,
         cssClasses: ["app-launcher"],
         exclusivity: Astal.Exclusivity.IGNORE,
         layer: Astal.Layer.OVERLAY,
         position: Position.TOP_CENTER,

         onKeyReleasedEvent: (self, event) => {
            if (event === Gdk.KEY_Escape) {
               self.hide();
               appMap.searchQuery.set("");
               entry.text = "";
               appMap.selectedIndex.set(null);
            }

            if (event === Gdk.KEY_Up) {
               const maxLength = appMap.length();
               let selectedIndexValue = appMap.selectedIndex.get();

               if (selectedIndexValue === null) {
                  selectedIndexValue = maxLength - 1;
               }

               if (selectedIndexValue > 0) {
                  appMap.selectedIndex.set(selectedIndexValue - 1);
               } else {
                  appMap.selectedIndex.set(0);
               }
            }

            if (event === Gdk.KEY_Down) {
               const maxLength = appMap.length();
               let selectedIndexValue = appMap.selectedIndex.get();
               if (selectedIndexValue === null) selectedIndexValue = -1;

               if (selectedIndexValue < maxLength - 1) {
                  appMap.selectedIndex.set(selectedIndexValue + 1);
               } else {
                  appMap.selectedIndex.set(maxLength - 1);
               }
            }
         },
      },

      mainBox
   );

   const onSearchQueryChanged = (searchQuery: string): void => {
      if (searchQuery === "") {
         hotswapBox.children = [emptyBox];
      } else if (searchQuery.startsWith(":sh")) {
         hotswapBox.children = [shBox];
         appMap.clear();
      } else {
         hotswapBox.children = [appsBox];
      }
   };

   onSearchQueryChanged(appMap.searchQuery.get());

   appMap.searchQuery.subscribe((searchQuery) => {
      onSearchQueryChanged(searchQuery);
   });

   return window;
}
