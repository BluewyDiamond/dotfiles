import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import Apps from "gi://AstalApps";
import { Gtk, Widget } from "astal/gtk4";
import options from "../../options";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import Pango from "gi://Pango";
import { createIcon } from "../../icons";

const apps = new Apps.Apps();

function AppButton(
   app: Apps.Application,
   selectedIndex: Variable<number | undefined>,
   indexInList: Variable<number | undefined>,
   onClicked: (self: Gtk.Button) => void
): Gtk.Button {
   let variable: Variable<void>;

   return Widget.Button(
      {
         hexpand: true,

         // prevents from stealing keyboard focus from entry
         // works because button does not need keyboard focus for now
         // alternatives: refactor AppWidget to where entry.grab_focus() can be called
         canFocus: false,

         onClicked: (self) => onClicked(self),

         setup: (self) => {
            variable = Variable.derive(
               [selectedIndex, indexInList],

               (selectedIndex, indexInList) => {
                  if (
                     typeof selectedIndex === "number" &&
                     typeof indexInList === "number" &&
                     selectedIndex === indexInList
                  ) {
                     self.cssClasses = [...self.cssClasses, "selected"];
                  } else {
                     self.cssClasses = self.cssClasses.filter(
                        (cssClass) => cssClass !== "selected"
                     );
                  }
               }
            );
         },

         onDestroy: () => variable.drop(),
      },

      Widget.Box({
         children: [
            IconWithLabelFallback({
               icon: createIcon(app.iconName),
            }),

            Widget.Box({
               valign: Gtk.Align.CENTER,
               vertical: true,

               setup: (self) => {
                  // instead notifying items one by one
                  // do the following
                  // it avoids weird allocation bugs
                  const children = [];

                  children.push(
                     Widget.Label({
                        cssClasses: ["name"],
                        halign: Gtk.Align.START,
                        xalign: 0,
                        ellipsize: Pango.EllipsizeMode.END,
                        label: app.name || "unknown",
                     })
                  );

                  if (app.description) {
                     children.push(
                        Widget.Label({
                           cssClasses: ["description"],
                           halign: Gtk.Align.START,
                           xalign: 0,
                           wrap: true,
                           wrapMode: Pango.WrapMode.WORD_CHAR,
                           label: app.description,
                        })
                     );
                  }

                  self.children = children;
               },
            }),
         ],
      })
   );
}

class AppWithIndex {
   widget: Gtk.Widget;
   indexInlist: Variable<number | undefined> = Variable(undefined);

   constructor(
      app: Apps.Application,
      selectedIndex: Variable<number | undefined>,
      onClicked: (self: Gtk.Button, app: Apps.Application) => void
   ) {
      this.widget = AppButton(app, selectedIndex, this.indexInlist, (self) =>
         onClicked(self, app)
      );
   }

   destroy() {
      this.indexInlist.drop();
   }
}

export default class AppMap implements Subscribable {
   searchQuery = Variable("");
   private map: Map<Apps.Application, AppWithIndex> = new Map();
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

   length(): number {
      return this.map.size;
   }

   update(
      selectedIndex: Variable<number | undefined>,
      onClicked: (self: Gtk.Button, app: Apps.Application) => void
   ) {
      const searchQuery = this.searchQuery.get();

      const queriedAppsSet = new Set(
         apps.fuzzy_query(searchQuery).slice(0, options.appLauncher.maxItems)
      );

      this.map.forEach((_, app) => {
         if (!queriedAppsSet.has(app)) {
            this.delete(app);
         }
      });

      queriedAppsSet.forEach((app) => {
         if (this.map.has(app)) return;
         this.set(
            app,

            new AppWithIndex(app, selectedIndex, (self, app) =>
               onClicked(self, app)
            )
         );
      });

      let orderedList: Gtk.Widget[] = [];
      let index = 0;

      for (const app of queriedAppsSet) {
         const appWithIndex = this.map.get(app);
         if (!appWithIndex) return;
         appWithIndex.indexInlist.set(index);
         orderedList.push(appWithIndex.widget);
         index++;
      }

      selectedIndex.set(undefined);
      this.var.set(orderedList);
   }

   launchApp(indexInList: number) {
      for (const [key, value] of this.map) {
         if (value.indexInlist.get() === indexInList) {
            key.launch();
         }
      }
   }

   clear() {
      this.map.forEach((_, app) => this.delete(app));
   }

   private set(key: Apps.Application, value: AppWithIndex) {
      const x = this.map.get(key);
      //x?.widget.destroy();
      x?.destroy();
      this.map.set(key, value);
   }

   private delete(key: Apps.Application) {
      const x = this.map.get(key);
      //x?.widget.destroy();
      x?.destroy();
      this.map.delete(key);
   }
}
