import { App } from "astal/gtk3";
import Bar from "./widgets/bar";
import { getCss } from "./style";

App.start({
   css: getCss(),
   instanceName: "some_name",

   main() {
      App.get_monitors().map(Bar);
   },
});
