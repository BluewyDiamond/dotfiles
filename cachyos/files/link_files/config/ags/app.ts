import { App } from "astal/gtk3";
import style from "./style.scss";
import Bar from "./widgets/bar";

App.start({
   css: style,
   instanceName: "some_name",
   main() {
      App.get_monitors().map(Bar);
   },
});
