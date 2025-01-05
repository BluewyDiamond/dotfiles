import { exec, execAsync, subprocess, Variable } from "astal";
import { bind } from "astal/binding";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Apps from "gi://AstalApps";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import options from "../../options";

const apps = new Apps.Apps();

function hide() {
   App.get_window("astal-app-launcher")?.hide();
}

function Content() {
   const searchQuery = Variable("");

   const queriedApps = searchQuery((searchQuery) => {
      return apps
         .fuzzy_query(searchQuery)
         .slice(0, options.appLauncher.maxItems);
   });

   const AppWidget = (app: Apps.Application): Widget.Button => {
      return new Widget.Button(
         {
            className: "rrr",

            onClick: () => {
               app.launch();
               hide();
               searchQuery.set("");
            },
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

   return new Widget.EventBox({
      child: new Widget.Box({
         className: "app-launcher-content",
         vertical: true,

         children: [
            new Widget.Entry({
               placeholderText: "Search",
               text: bind(searchQuery),
               onChanged: (self) => searchQuery.set(self.text),

               onActivate: () => {
                  const currentSearchQuery = searchQuery.get();

                  if (currentSearchQuery.startsWith(":sh")) {
                     execAsync([
                        "fish",
                        "-c",
                        `${currentSearchQuery.slice(3)}`.trim(),
                     ]);
                  } else {
                     if (!queriedApps.get()[0].launch()) {
                     }
                  }

                  hide();
                  searchQuery.set("");
               },
            }),

            new Widget.Box({
               vertical: true,

               setup: (self) => {
                  function onAppsChanged() {
                     queriedApps.subscribe((apps) => {
                        self.children = [];

                        apps.map((app) => {
                           self.children = [...self.children, AppWidget(app)];
                        });
                     });
                  }

                  onAppsChanged();
               },
            }),
         ],
      }),
   });
}

export default function (gdkmonitor: Gdk.Monitor): Widget.Window {
   return new Widget.Window({
      gdkmonitor: gdkmonitor,
      name: "astal-app-launcher",
      className: "app-launcher",
      exclusivity: Astal.Exclusivity.IGNORE,
      keymode: Astal.Keymode.ON_DEMAND,
      anchor: Astal.WindowAnchor.TOP,
      visible: false,

      onKeyPressEvent: function (self, event: Gdk.Event) {
         if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
      },

      child: Content(),
   });
}
