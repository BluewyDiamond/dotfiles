import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import DateTimeMenuButton from "./composables/DateTimeMenubutton";
import IndicatorsBox from "./composables/IndicatorsBox";
import TrayBox from "./composables/TrayBox";
import ControlCenterButton from "./composables/ControlCenterButton";
import { Accessor, onCleanup } from "ags";

export default function BarWindow({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
   const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

   return (
      <window
         $={(self) => onCleanup(() => self.destroy())}
         gdkmonitor={gdkmonitor}
         name="ags_bar"
         namespace="ags_bar"
         cssClasses={["bar-window"]}
         anchor={TOP | LEFT | RIGHT}
         exclusivity={Astal.Exclusivity.EXCLUSIVE}
         application={app}
         visible
      >
         <centerbox>
            <box $type="start"></box>

            <centerbox $type="center">
               <box $type="start"></box>

               <box $type="center">
                  <DateTimeMenuButton $type="center" />
               </box>

               <box $type="end"></box>
            </centerbox>

            <box $type="end">
               <TrayBox />
               <IndicatorsBox />
               <ControlCenterButton />
            </box>
         </centerbox>
      </window>
   );
}
