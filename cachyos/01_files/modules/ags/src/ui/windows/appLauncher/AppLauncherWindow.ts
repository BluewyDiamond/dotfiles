import { execAsync } from "astal";
import { App, Astal, Gdk, type Gtk, Widget } from "astal/gtk4";
import AppsEfficientRendering from "./AppsEfficientRendering";
import PopupWindow, { Position } from "../../composables/PopupWindow";
import options from "../../../options";
import { IconWithLabelFallback } from "../../composables/IconWithLabelFallback";
import icons from "../../../libs/icons";

function hide(): void {
   App.get_window(options.appLauncher.name)?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Astal.Window {
   let entry: Gtk.Entry | null = null;

   const appsEfficientRendering = new AppsEfficientRendering(() => {
      hide();
      appsEfficientRendering.searchQuery.set("");

      if (entry !== null) {
         entry.text = "";
      }
   });

   entry = Widget.Entry({
      cssClasses: ["search"],
      hexpand: true,
      placeholderText: "Search",

      onChanged: (self) => {
         appsEfficientRendering.searchQuery.set(self.text);
      },

      onActivate: (self) => {
         const currentSearchQuery = appsEfficientRendering.searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            void execAsync([
               ...options.general.sh.cmd,
               currentSearchQuery.slice(3).trim(),
            ]);
         } else if (currentSearchQuery.startsWith(":refresh")) {
            appsEfficientRendering.reload();
            self.text = "";
            return;
         } else {
            let selectedIndexValue = appsEfficientRendering.selectedIndex.get();
            if (selectedIndexValue === null) selectedIndexValue = 0;
            appsEfficientRendering.launchApp(selectedIndexValue);
         }

         hide();
         appsEfficientRendering.searchQuery.set("");
         appsEfficientRendering.selectedIndex.set(null);
         self.text = "";
      },
   });

   const appsBox = Widget.Box({
      cssClasses: ["apps-box"],
      vertical: true,

      setup: (self) => {
         self.children = appsEfficientRendering.get();
         appsEfficientRendering.subscribe(
            (widgets) => (self.children = widgets)
         );
      },

      onDestroy: () => {
         appsEfficientRendering.destroy();
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
                     iconName: icons.ui.refresh.symbolic,
                  }),

                  onClicked: () => {
                     appsEfficientRendering.reload();
                     const searchQuery =
                        appsEfficientRendering.searchQuery.get();
                     appsEfficientRendering.searchQuery.set("");
                     appsEfficientRendering.searchQuery.set(searchQuery);
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
         clickThroughFiller: true,
         exclusivity: Astal.Exclusivity.IGNORE,
         layer: Astal.Layer.OVERLAY,
         position: Position.TOP_CENTER,

         onKeyReleasedEvent: (self, event) => {
            if (event === Gdk.KEY_Escape) {
               self.hide();
               appsEfficientRendering.searchQuery.set("");
               appsEfficientRendering.selectedIndex.set(null);
               entry.text = "";
            }

            if (event === Gdk.KEY_Up) {
               const maxLength = appsEfficientRendering.length();
               let selectedIndexValue =
                  appsEfficientRendering.selectedIndex.get();

               if (selectedIndexValue === null) {
                  selectedIndexValue = maxLength - 1;
               }

               if (selectedIndexValue > 0) {
                  appsEfficientRendering.selectedIndex.set(
                     selectedIndexValue - 1
                  );
               } else {
                  appsEfficientRendering.selectedIndex.set(0);
               }
            }

            if (event === Gdk.KEY_Down) {
               const maxLength = appsEfficientRendering.length();
               let selectedIndexValue =
                  appsEfficientRendering.selectedIndex.get();
               if (selectedIndexValue === null) selectedIndexValue = -1;

               if (selectedIndexValue < maxLength - 1) {
                  appsEfficientRendering.selectedIndex.set(
                     selectedIndexValue + 1
                  );
               } else {
                  appsEfficientRendering.selectedIndex.set(maxLength - 1);
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
         appsEfficientRendering.clear();
      } else {
         hotswapBox.children = [appsBox];
      }
   };

   onSearchQueryChanged(appsEfficientRendering.searchQuery.get());

   appsEfficientRendering.searchQuery.subscribe((searchQuery) => {
      onSearchQueryChanged(searchQuery);
   });

   return window;
}
