import { Widget } from "astal/gtk3";
import PowerProfiles from "gi://AstalPowerProfiles";
import { curateIcon, printError } from "../../../../libs/utils";
import icons from "../../../../libs/icons";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import CustomIcon from "../../../../libs/wrappers/CustomIcon";

const errorTitle = "PowerProfileIndicator";

export default function (): Widget.Box {
  const powerProfiles = PowerProfiles.get_default();

  return new Widget.Box({
    setup: (self) => {
      // init
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
          powerProfileStates.find(([state]) => state === powerProfile)?.[1] ||
          "";

        self.children = [CustomIcon({ icon2: icon })];
        self.visible = true;
      }
    },
  });
}
