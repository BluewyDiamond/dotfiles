import { Subscribable } from "astal/binding";
import { Variable } from "astal";
import Apps from "gi://AstalApps";
import { Gtk, Widget } from "astal/gtk3";
import options from "../../options";
import { IconWithLabelFallback } from "../wrappers/IconWithLabelFallback";
import Pango from "gi://Pango";

const apps = new Apps.Apps();

function AppWidget(
   app: Apps.Application,
   selectedIndex: Variable<number>,
   indexInList: Variable<number>,
   onClicked: (app: Apps.Application) => void
): Widget.Button {
   let variable: Variable<void>;

   return new Widget.Button(
      {
         hexpand: true,

         // prevents from stealing keyboard focus from entry
         // works because button does not need keyboard focus for now
         // alternatives: refactor AppWidget to where entry.grab_focus() can be called
         canFocus: false,

         onClick: () => {
            onClicked(app);
         },

         setup: (self) => {
            variable = Variable.derive(
               [selectedIndex, indexInList],
               (selectedIndex, indexInList) => {
                  self.toggleClassName(
                     "selected",
                     selectedIndex === indexInList
                  );
               }
            );
         },

         onDestroy: () => {
            variable.drop();
         },
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

class AppWithIndex {
   widget: Gtk.Widget;
   indexInlist = Variable(-1);

   constructor(
      app: Apps.Application,
      selectedIndex: Variable<number>,
      onClicked: (app: Apps.Application) => void
   ) {
      this.widget = AppWidget(app, selectedIndex, this.indexInlist, onClicked);
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
      selectedIndex: Variable<number>,
      onClick: (app: Apps.Application) => void
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
         this.set(app, new AppWithIndex(app, selectedIndex, onClick));
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

      selectedIndex.set(0);
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
      x?.widget.destroy();
      x?.destroy();
      this.map.set(key, value);
   }

   private delete(key: Apps.Application) {
      const x = this.map.get(key);
      x?.widget.destroy();
      x?.destroy();
      this.map.delete(key);
   }
}
