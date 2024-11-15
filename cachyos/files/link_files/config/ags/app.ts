import { App } from "astal/gtk3";
import style from "./style.scss";
import Bar from "./widgets/bar/Bar";
import Test from "./widgets/Test";

App.start({
   css: style,
   main() {
      App.get_monitors().map(Test);
   },
});
