import { execAsync } from "astal";
import { App, Astal, Gdk, type Gtk, Widget } from "astal/gtk4";
import AppMap from "./AppMap";
import PopupWindow, { Position } from "../composables/popupWindow";
import options from "../../options";
import { IconWithLabelFallback } from "../composables/iconWithLabelFallback";
import icons from "../../libs/icons";

function hide(): void {
   App.get_window(options.appLauncher.name)?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   let entry: Gtk.Entry | null = null;

   const appMap = new AppMap(() => {
      hide();
      appMap.searchQuery.set("");

      if (entry !== null) {
         entry.text = "";
      }
   });

   entry = Widget.Entry({
      cssClasses: ["search"],
      hexpand: true,
      placeholderText: "Search",

      onChanged: (self) => {
         appMap.searchQuery.set(self.text);
      },

      onActivate: (self) => {
         const currentSearchQuery = appMap.searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            void execAsync([
               ...options.sh.cmd,
               currentSearchQuery.slice(3).trim(),
            ]);
         } else if (currentSearchQuery.startsWith(":refresh")) {
            appMap.reload();
            self.text = "";
            return;
         } else {
            let selectedIndexValue = appMap.selectedIndex.get();
            if (selectedIndexValue === null) selectedIndexValue = 0;
            appMap.launchApp(selectedIndexValue);
         }

         hide();
         appMap.searchQuery.set("");
         appMap.selectedIndex.set(null);
         self.text = "";
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

      children: [
         Widget.Box({
            cssClasses: ["the-box"],
            hexpand: true,
            children: [
               entry,

               Widget.Button({
                  cssClasses: ["refresh"],
                  canFocus: false,

                  child: IconWithLabelFallback({
                     icon: icons.ui.refresh,
                     symbolic: options.appLauncher.refresh.symbolic,
                  }),

                  onClicked: () => {
                     appMap.reload();
                     const searchQuery = appMap.searchQuery.get();
                     appMap.searchQuery.set("");
                     appMap.searchQuery.set(searchQuery);
                  },
               }),
            ],
         }),

         hotswapBox,
      ],
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
               appMap.selectedIndex.set(null);
               entry.text = "";
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
