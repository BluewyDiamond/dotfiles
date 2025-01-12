import { Subscribable } from "astal/binding";
import Hookable from "../../libs/Hookable";
import { timeout, Variable } from "astal";
import Apps from "gi://AstalApps";
import { Gtk, Widget } from "astal/gtk3";
import options from "../../options";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import Pango from "gi://Pango";

const apps = new Apps.Apps();

function AppWidget(
   app: Apps.Application,
   onClick: (app: Apps.Application) => void
): Widget.Button {
   return new Widget.Button(
      {
         hexpand: true,

         onClick: () => {
            onClick(app);
         },

         // prevents from stealing keyboard focus from entry
         // works because button does not need keyboard focus for now
         // alternatives: refactor AppWidget to where entry.grab_focus() can be called
         canFocus: false,
      },

      new Widget.Box({
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
                        className: "name",
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
                           className: "description",
                           halign: Gtk.Align.START,
                           xalign: 0,
                           wrap: true,
                           wrapMode: Pango.WrapMode.WORD_CHAR,
                           label: app.description,
                        }),
                     ];
                  }
               },
            }),
         ],
      })
   );
}

export default class AppMapp implements Subscribable {
   searchQuery = Variable("");
   private map: Map<Apps.Application, Gtk.Widget> = new Map();
   private var: Variable<Gtk.Widget[]> = new Variable([]);

   constructor() {
      // updates are called manually
   }

   get() {
      return this.var.get();
   }

   subscribe(callback: (list: Array<Gtk.Widget>) => void) {
      return this.var.subscribe(callback);
   }

   destroy() {
      this.var.drop();
   }

   update(onClick: (app: Apps.Application) => void) {
      const searchQuery = this.searchQuery.get();

      const queriedApps = new Set(
         apps.fuzzy_query(searchQuery).slice(0, options.appLauncher.maxItems)
      );

      this.map.forEach((_, app) => {
         if (!queriedApps.has(app)) {
            this.delete(app);
         }
      });

      queriedApps.forEach((app) => {
         if (this.map.has(app)) return;

         this.set(
            app,
            AppWidget(app, () => onClick(app))
         );
      });
   }

   launchApp() {
      this.map.entries().next().value?.[0].launch();
   }

   clear() {
      this.map.forEach((_, app) => this.delete(app));
   }

   private set(key: Apps.Application, value: Gtk.Widget) {
      this.map.get(key)?.destroy();
      this.map.set(key, value);
      this.notify();
   }

   private delete(key: Apps.Application) {
      this.map.get(key)?.destroy();
      this.map.delete(key);
      this.notify();
   }

   private notify() {
      this.var.set([...this.map.values()]);
   }
}
