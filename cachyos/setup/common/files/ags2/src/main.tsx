import app from "ags/gtk4/app";
// @ts-expect-error stop_complaining
import style from "./scss/main.scss";
import BarWindow from "./ui/windows/bar/BarWindow.tsx";
import NotificationToastsWindow from "./ui/windows/notificationToasts/NotificationToastsWindow.tsx";
import ControlCenterWindow from "./ui/windows/controlCenter/ControlCenterWindow.tsx";
import AstalHyprland from "gi://AstalHyprland";
import {
   createBinding,
   createExternal,
   createState,
   For,
   onCleanup,
   This,
} from "ags";
import { timeout } from "ags/time.ts";
import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk";

app.start({
   css: style,

   main() {
      five();
   },
});

function one() {
   // const onMonitorsChanged = () => {
   //    app.get_windows().forEach((window) => {
   //       app.remove_window(window);
   //       window.destroy();
   //    });
   //
   //    const monitorsLength = monitors.get_n_items();
   //
   //    for (let i = 0; i < monitorsLength; i++) {
   //       const monitor = monitors.get_item(i);
   //
   //       if (monitor === null) {
   //          console.log(`index: ${i} is invalid`);
   //          continue;
   //       }
   //
   //       if (!(monitor instanceof Gdk.Monitor)) {
   //          console.log(`index: ${i} is not instace of Gdk.Monitor`);
   //          continue;
   //       }
   //
   //       print(
   //          `index: ${i}: model: ${monitor.model} valid: ${monitor.is_valid()}`
   //       );
   //
   //       timeout(2000, () => {
   //          app.add_window(
   //             createRoot((dispose) => {
   //                const win = BarWindow({ gdkmonitor: monitor });
   //                win.connect("destroy", dispose);
   //                return win;
   //             })
   //          );
   //       });
   //    }
   // };
   //
   // monitors.connect("items-changed", () => {
   //    onMonitorsChanged();
   // });
   //
   // onMonitorsChanged();
   // interval(3000, () => {
   //    print("monitors debug");
   //
   //    const monitorsLength = monitors.get_n_items();
   //
   //    for (let i = 0; i < monitorsLength; i++) {
   //       const monitor = monitors.get_item(i);
   //       if (monitor === null) {
   //          console.log(`index: ${i} is invalid`);
   //          continue;
   //       }
   //
   //       if (!(monitor instanceof Gdk.Monitor)) {
   //          console.log(`index: ${i} is not instace of Gdk.Monitor`);
   //          continue;
   //       }
   //
   //       print(
   //          `index: ${i}: model: ${monitor.model} valid: ${monitor.is_valid()}`
   //       );
   //
   //    }
   // });
}

function two() {
   const gdkDisplay = Gdk.Display.get_default()!;
   const monitors = gdkDisplay.get_monitors();
   const [monitorsState, setMonitorsState] = createState<Gdk.Monitor[]>([]);

   const onMonitorsChanged = () => {
      const monitorsLength = monitors.get_n_items();
      const newMonitors: Gdk.Monitor[] = [];

      for (let i = 0; i < monitorsLength; i++) {
         const monitor = monitors.get_item(i);
         if (monitor === null) continue;
         if (!(monitor instanceof Gdk.Monitor)) continue;

         newMonitors.push(monitor);
      }

      timeout(2000, () => {
         setMonitorsState(newMonitors);
      });
   };

   const itemsChangedSignalID = monitors.connect("items-changed", () => {
      onMonitorsChanged();
   });

   onMonitorsChanged();

   return (
      <For
         each={monitorsState}
         cleanup={(window) => (window as Gtk.Window).destroy()}
      >
         {(monitor) => {
            return <BarWindow gdkmonitor={monitor} />;
         }}
      </For>
   );
}

function three() {
   const gdkDisplay = Gdk.Display.get_default()!;
   const monitors = gdkDisplay.get_monitors();
   const [monitorsState, setMonitorsState] = createState<Gdk.Monitor[]>([]);

   const onMonitorsChanged = () => {
      timeout(2000, () => {
         setMonitorsState(app.get_monitors());
      });
   };

   monitors.connect("items-changed", () => {
      onMonitorsChanged();
   });

   onMonitorsChanged();

   return (
      <For
         each={monitorsState}
         cleanup={(window) => (window as Gtk.Window).destroy()}
      >
         {(monitor) => {
            return <BarWindow gdkmonitor={monitor} />;
         }}
      </For>
   );
}

function four() {
   const monitorsBinding = createBinding(app, "monitors");
   const [monitorsState, setMonitorsState] = createState<Gdk.Monitor[]>([]);

   const onMonitorsChanged = () => {
      timeout(2000, () => {
         setMonitorsState(app.get_monitors());
      });
   };

   monitorsBinding.subscribe(() => {
      onMonitorsChanged();
   });

   onMonitorsChanged();

   return (
      <For
         each={monitorsState}
         cleanup={(window) => (window as Gtk.Window).destroy()}
      >
         {(monitor) => {
            return <BarWindow gdkmonitor={monitor} />;
         }}
      </For>
   );
}

function five() {
   const gdkDisplay = Gdk.Display.get_default()!;
   const monitors = gdkDisplay.get_monitors();

   const monitorsExternal = createExternal<Gdk.Monitor[]>([], (set) => {
      const onMonitorsChanged = () => {
         const monitorsLength = monitors.get_n_items();
         const newMonitors: Gdk.Monitor[] = [];

         for (let i = 0; i < monitorsLength; i++) {
            const monitor = monitors.get_item(i);
            if (monitor === null) continue;
            if (!(monitor instanceof Gdk.Monitor)) continue;

            newMonitors.push(monitor);
         }

         // setTimeout from ags doesn't work as expected and leads to a crash
         // timeout from astal works fine
         // it is needed because as user mentioned the monitor starts as null and is later changed
         timeout(2000, () => {
            set(newMonitors);
         });
      };

      const itemsChangedSignalID = monitors.connect("items-changed", () => {
         onMonitorsChanged();
      });

      onMonitorsChanged();

      return () => {
         monitors.disconnect(itemsChangedSignalID);
      };
   });

   return (
      <For each={monitorsExternal}>
         {(monitor) => (
            <This this={app}>
               <BarWindow gdkmonitor={monitor} />
               <ControlCenterWindow gdkmonitor={monitor} />
               <NotificationToastsWindow gdkmonitor={monitor} />
            </This>
         )}
      </For>
   );
}
