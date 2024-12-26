import { App } from "astal/gtk3";
import Bar from "./widgets/bar";
import { getCss } from "./style";
import NotificationPopups from "./widgets/notifications";

App.start({
   css: getCss(),
   instanceName: "some_name",

   main() {
      App.get_monitors().map(Bar);
      App.get_monitors().map(NotificationPopups);
   },
});
