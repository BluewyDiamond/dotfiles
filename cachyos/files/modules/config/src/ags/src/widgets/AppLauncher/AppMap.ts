import type { Subscribable } from "astal/binding";
import { Variable } from "astal";
import Apps from "gi://AstalApps";
import { Gtk, Widget } from "astal/gtk4";
import options from "../../options";
import Pango from "gi://Pango";
import { createIcon } from "../../libs/icons";
import { IconWithLabelFallback } from "../composables/IconWithLabelFallback";

const apps = new Apps.Apps();

function AppButton(
   app: Apps.Application,
   selectedIndex: Variable<number | null>,
   indexInList: Variable<number | null>,
   onClicked: (self: Gtk.Button) => void
): Gtk.Button {
   let variable: Variable<void> | null = null;

   return Widget.Button(
      {
         hexpand: true,

         // prevents from stealing keyboard focus from entry
         // works because button does not need keyboard focus for now
         // alternatives: refactor AppWidget to where entry.grab_focus() can be called
         canFocus: false,

         onClicked: (self) => {
            onClicked(self);
         },

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

         onDestroy: () => variable?.drop(),
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
                        label: app.name === "" ? "unknown" : app.name,
                     })
                  );

                  if (app.description !== "") {
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

class AppButtonWithIndex {
   widget: Gtk.Widget;
   indexInlist: Variable<number | null> = Variable(null);

   constructor(
      app: Apps.Application,
      selectedIndex: Variable<number | null>,
      onClicked: (self: Gtk.Button, app: Apps.Application) => void
   ) {
      this.widget = AppButton(app, selectedIndex, this.indexInlist, (self) => {
         onClicked(self, app);
      });
   }

   destroy(): void {
      this.indexInlist.drop();
   }
}

export default class AppMap implements Subscribable {
   private readonly map: Map<Apps.Application, AppButtonWithIndex> = new Map<
      Apps.Application,
      AppButtonWithIndex
   >();

   private readonly variable: Variable<Gtk.Widget[]> = new Variable<
      Gtk.Widget[]
   >([]);

   searchQuery = Variable("");
   selectedIndex: Variable<number | null> = Variable(null);

   constructor(onAppClicked: () => void) {
      this.searchQuery.subscribe((searchQuery) => {
         if (searchQuery === "") {
            this.clear();
            return;
         }

         const queriedAppsSet = new Set(
            apps.fuzzy_query(searchQuery).slice(0, options.appLauncher.maxItems)
         );

         this.map.forEach((_, app) => {
            if (!queriedAppsSet.has(app)) {
               this.map.delete(app);
            }
         });

         const onClicked = (app: Apps.Application): void => {
            app.launch();
            this.searchQuery.set("");
         };

         queriedAppsSet.forEach((app) => {
            if (this.map.has(app)) return;
            this.map.set(
               app,

               new AppButtonWithIndex(app, this.selectedIndex, () => {
                  onAppClicked();
                  onClicked(app);
               })
            );
         });

         const orderedList: Gtk.Widget[] = [];
         let index = 0;

         for (const app of queriedAppsSet) {
            const appButtonWithIndex = this.map.get(app);
            if (appButtonWithIndex === undefined) continue;

            appButtonWithIndex.indexInlist.set(index);
            orderedList.push(appButtonWithIndex.widget);
            index++;
         }

         this.selectedIndex.set(null);
         this.variable.set(orderedList);
      });
   }

   get(): Gtk.Widget[] {
      return this.variable.get();
   }

   subscribe(callback: (list: Gtk.Widget[]) => void): () => void {
      return this.variable.subscribe(callback);
   }

   destroy(): void {
      this.variable.drop();
      this.searchQuery.drop();
      this.selectedIndex.drop();
   }

   length(): number {
      return this.map.size;
   }

   launchApp(indexInList: number): void {
      for (const [key, value] of this.map) {
         if (value.indexInlist.get() === indexInList) {
            key.launch();
         }
      }
   }

   reload(): void {
      apps.reload();
   }

   clear(): void {
      this.map.forEach((_, app) => this.map.delete(app));
   }
}
