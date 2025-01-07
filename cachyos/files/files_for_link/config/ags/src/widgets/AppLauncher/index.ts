import { execAsync, Variable } from "astal";
import { bind } from "astal/binding";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import options from "../../options";

const apps = new Apps.Apps();

function hide() {
   App.get_window("astal-app-launcher")?.hide();
}

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   const searchQuery = Variable("");
   const appsM = Variable<Apps.Application[]>([]);

   const AppWidget = (app: Apps.Application): Widget.Button => {
      return new Widget.Button(
         {
            className: "rrr",
            hexpand: true,

            onClick: () => {
               app.launch();
               hide();
               searchQuery.set("");
            },

            // prevents from stealing keyboard focus from entry
            // works because button does not need keyboard focus for now
            // alternatives: refactor AppWidget to where entry.grab_focus() can be called
            canFocus: false,
         },

         new Widget.Box({
            className: "app-launcher-app",

            children: [
               IconWithLabelFallback({
                  icon: app.iconName,
               }),

               new Widget.Box({
                  valign: Gtk.Align.CENTER,
                  vertical: true,

                  setup: (self) => {
                     self.children = [
                        new Widget.Label({
                           className: "app-launcher-app-name",
                           halign: Gtk.Align.START,
                           xalign: 0,
                           truncate: true,
                           label: app.name,
                        }),
                     ];

                     if (app.description) {
                        self.children = [
                           ...self.children,

                           new Widget.Label({
                              className: "app-launcher-app-description",
                              halign: Gtk.Align.START,
                              xalign: 0,
                              wrap: true,
                              label: app.description,
                           }),
                        ];
                     }
                  },
               }),
            ],
         })
      );
   };

   const entry = new Widget.Entry({
      className: "app-launcher-content-entry",
      placeholderText: "Search",
      text: bind(searchQuery),
      onChanged: (self) => searchQuery.set(self.text),

      onActivate: () => {
         const currentSearchQuery = searchQuery.get();

         if (currentSearchQuery.startsWith(":sh")) {
            execAsync(["fish", "-c", `${currentSearchQuery.slice(3)}`.trim()]);
         } else {
            appsM.get()[0]?.launch();
         }

         hide();
         searchQuery.set("");
      },
   });

   const appsBox = new Widget.Box({
      className: "app-launcher-content-apps",
      vertical: true,
   });

   const shBox = new Widget.Box({
      children: [new Widget.Label({ label: "shbox mode! :3" })],
   });

   const emptyBox = new Widget.Box({
      children: [new Widget.Label({ label: "empty..." })],
   });

   const hotswapBox = new Widget.Box({
      className: "app-launcher-content-hotswap",
   });

   const contentBox = new Widget.Box({
      className: "app-launcher-content",
      vertical: true,

      children: [entry, hotswapBox],
   });

   const window = new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-app-launcher",
      className: "app-launcher",
      exclusivity: Astal.Exclusivity.IGNORE,
      keymode: Astal.Keymode.ON_DEMAND,
      anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM,
      visible: false,

      onKeyReleaseEvent: (self, event) => {
         if (event.get_keyval()[1] === Gdk.KEY_Escape) {
            self.hide();
            searchQuery.set("");
         }
      },

      child: contentBox,
   });

   function onSearchQueryChanged(searchQuery: string) {
      if (searchQuery === "") {
         hotswapBox.children = [emptyBox];
      } else if (searchQuery.startsWith(":sh")) {
         hotswapBox.children = [shBox];
      } else {
         const queriedApps = apps
            .fuzzy_query(searchQuery)
            .slice(0, options.appLauncher.maxItems);

         appsM.set(queriedApps);
         const appWidgets = queriedApps.map((app) => AppWidget(app));
         appsBox.children = appWidgets;

         hotswapBox.children = [appsBox];
      }
   }

   searchQuery.subscribe((searchQuery) => {
      onSearchQueryChanged(searchQuery);
   });

   return window;
}
