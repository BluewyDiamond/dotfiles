import { Widget } from "astal/gtk3";
import PowerProfiles from "gi://AstalPowerProfiles";
import { curateIcon, printError } from "../../../../libs/utils";

const errorTitle = "PowerProfileIndicator";

export default function (): Widget.Box {
  const powerProfiles = PowerProfiles.get_default();

  return new Widget.Box({
    setup: (self) => {
      self.hook(powerProfiles, "notify", () => {
        const powerProfile = powerProfiles.get_active_profile();
        const curatedIcon = curateIcon(powerProfile);

        if (curatedIcon !== "") {
          self.children = [new Widget.Icon({ icon: curatedIcon })];
        } else if (powerProfile !== "") {
          self.children = [new Widget.Label({ label: powerProfile })];
        } else {
          printError(`${errorTitle} => there is nothing to show...`);
          self.children = [new Widget.Label({ label: "󱪗" })];
        }

        self.visible = true;
      });
    },
  });
}
