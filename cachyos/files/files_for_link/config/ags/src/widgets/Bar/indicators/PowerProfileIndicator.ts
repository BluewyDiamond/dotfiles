import { Widget } from "astal/gtk3";
import PowerProfiles from "gi://AstalPowerProfiles";
import icons from "../../../libs/icons";
import { findIcon } from "../../../utils";

export default function (): Widget.Box {
   const powerProfiles = PowerProfiles.get_default();

   return new Widget.Box({
      setup: (self) => {
         onPowerProfileChange(powerProfiles);

         self.hook(powerProfiles, "notify", () => {
            onPowerProfileChange(powerProfiles);
         });

         function onPowerProfileChange(
            powerProfiles: PowerProfiles.PowerProfiles
         ) {
            const powerProfile = powerProfiles.get_active_profile();

            const { balanced, powerSaver, performance } = icons.powerprofile;

            const powerProfileStates = [
               ["balanced", balanced],
               ["powersaver", powerSaver],
               ["performance", performance],
            ] as const;

            const icon =
               powerProfileStates.find(
                  ([state]) => state === powerProfile
               )?.[1] || "";

            let curatedIcon = findIcon(icon);

            if (curatedIcon === "") {
               self.children = [new Widget.Label({ label: "?" })];
            } else {
               self.children = [new Widget.Icon({ icon: curatedIcon })];
            }

            self.visible = true;
         }
      },
   });
}
