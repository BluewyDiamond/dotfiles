import { createExternal } from "ags";
import app from "ags/gtk4/app";
import options from "../../../../options";

export default function () {
   const controlCenterWindowName = "ags_control_center";

   const iconNameExternal = createExternal(
      options.bar.controlCenterButton.arrowDown,
      (set) => {
         const onWindowToggled = () => {
            const foundControlCenterWindow = app
               .get_windows()
               .find((window) => window.name === controlCenterWindowName);

            if (foundControlCenterWindow === undefined) return;

            if (foundControlCenterWindow.name != controlCenterWindowName)
               return;

            if (foundControlCenterWindow.visible) {
               set(options.bar.controlCenterButton.arrowUp);
            } else {
               set(options.bar.controlCenterButton.arrowDown);
            }
         };

         const toggledWindowConnectionId = app.connect(
            "window-toggled",
            (_broken_value) => {
               onWindowToggled();
            }
         );

         onWindowToggled();

         return () => app.disconnect(toggledWindowConnectionId);
      }
   );

   return (
      <button
         cssClasses={["control-center-button"]}
         onClicked={() => {
            app.toggle_window(controlCenterWindowName);
         }}
      >
         <image iconName={iconNameExternal} />
      </button>
   );
}
