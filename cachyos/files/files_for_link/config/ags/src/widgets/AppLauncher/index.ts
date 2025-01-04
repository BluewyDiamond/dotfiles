import { timeout, Variable } from "astal";
import { bind, Subscribable } from "astal/binding";
import { App, Astal, Gdk, Gtk, Widget } from "astal/gtk3";
import Notifd from "gi://AstalNotifd";
import Notification from "../wrappers/Notification";
import Apps from "gi://AstalApps";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";

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

function Content() {
   const apps = new Apps.Apps();
   const searchQuery = Variable("");

   const queryResults = searchQuery((searchQuery) => {
      return apps.fuzzy_query(searchQuery).slice(0, 5);
   });

   return new Widget.EventBox({
      //widthRequest: 400,

      child: new Widget.Box({
         className: "app-launcher-content",
         vertical: true,

         children: [
            new Widget.Entry({
               placeholderText: "Search",
               text: bind(searchQuery),
               onChanged: (self) => searchQuery.set(self.text),

               onActivate: () => {
                  if (!queryResults.get()[0].launch()) {
                     try {
                        const notifd = Notifd.get_default();
                     } catch {}
                  }

                  hide();
                  searchQuery.set("");
               },
            }),

            new Widget.Box({
               vertical: true,

               setup: (self) => {
                  onAppsChanged();

                  function onAppsChanged() {
                     queryResults.subscribe((list) => {
                        const aw = list.map((app) => {
                           return AppWidget(app);
                        });

                        self.children = aw;
                     });
                  }
               },
            }),
         ],
      }),
   });
}

function AppWidget(app: Apps.Application): Widget.Box {
   return new Widget.Box({
      className: "app-launcher-app",

      children: [
         IconWithLabelFallback(app.iconName, {}),

         new Widget.Box({
            vertical: true,

            setup: (self) => {
               self.children = [
                  new Widget.Label({
                     halign: Gtk.Align.START,
                     xalign: 0,
                     label: app.name,
                  }),
               ];

               if (app.description) {
                  self.children = [
                     ...self.children,

                     new Widget.Label({
                        halign: Gtk.Align.START,
                        xalign: 0,
                        truncate: true,
                        label: app.description,
                     }),
                  ];
               }
            },
         }),
      ],
   });
}

function hide() {
   App.get_window("astal-app-launcher")?.hide();
}
