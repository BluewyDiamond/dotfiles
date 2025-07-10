import app from "ags/gtk4/app";
// @ts-expect-error stop_complaining
import style from "./scss/style.scss";
import BarWindow from "./ui/windows/bar/BarWindow.tsx";

app.start({
   css: style,
   // iconTheme: "candy-icons",

   main() {
      app.get_monitors().map(BarWindow);
   },
});
