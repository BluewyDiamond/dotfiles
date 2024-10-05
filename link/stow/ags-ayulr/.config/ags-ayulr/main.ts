import "lib/session";
import "style/style";
import init from "lib/init";
import options from "options";
import Bar from "widget/bar/Bar";
import Launcher from "widget/launcher/Launcher";
import NotificationPopups from "widget/notifications/NotificationPopups";
import OSD from "widget/osd/OSD";
import Overview from "widget/overview/Overview";
import PowerMenu from "widget/powermenu/PowerMenu";
import ScreenCorners from "widget/bar/ScreenCorners";
import SettingsDialog from "widget/settings/SettingsDialog";
import Verification from "widget/powermenu/Verification";
import { forMonitors } from "lib/utils";
import { setupQuickSettings } from "widget/quicksettings/QuickSettings";
import { setupDateMenu } from "widget/datemenu/DateMenu";
import { BarSeparator, BarSeparatorShadow } from "widget/bar/BarSeparator";

App.config({
   onConfigParsed: () => {
      setupQuickSettings();
      setupDateMenu();
      init();
   },
   closeWindowDelay: {
      "ags-launcher": options.transition.value,
      "ags-overview": options.transition.value,
      "ags-quicksettings": options.transition.value,
      "ags-datemenu": options.transition.value,
   },
   windows: () => [
      ...forMonitors(Bar),
      ...forMonitors(NotificationPopups),
      ...forMonitors(BarSeparator),
      ...forMonitors(BarSeparatorShadow),
      ...forMonitors(OSD),
      Launcher(),
      Overview(),
      PowerMenu(),
      SettingsDialog(),
      Verification(),
   ],
});
