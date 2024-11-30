import { Widget } from "astal/gtk3";
import PowerProfiles from "gi://AstalPowerProfiles";
import { curateIcon, printError } from "../../../../libs/utils";
import icons from "../../../../libs/icons";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";

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

        const curatedIcon = curateIcon(
          powerProfileStates.find(([state]) => state === powerProfile)?.[1] ||
            ""
        );

        if (curatedIcon !== "") {
          self.children = [new Widget.Icon({ icon: curatedIcon })];
        } else if (powerProfile !== "") {
          self.children = [new Widget.Label({ label: powerProfile })];
        } else {
          printError(`${errorTitle} => there is nothing to show...`);
          self.children = [new Widget.Label({ label: "󱪗" })];
        }

        self.visible = true;
      }
    },
  });
}
