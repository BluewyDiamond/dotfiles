import { IconProps } from "astal/gtk3/widget";
import { Widget } from "astal/gtk3";
import icons from "../../libs/icons";
import { curateIcon } from "../../utils";

export default ({ icon2, ...props }: CustomIcon) => {
  if (icon2 === undefined) {
    return new Widget.Label({ label: "?" });
  }

  const iconCurated = curateIcon(icon2);

  if (iconCurated !== "") {
    return new Widget.Icon({ icon: iconCurated, ...props });
  } else {
    const iconMissing = curateIcon(icons.missing);

    if (iconMissing !== "") {
      return new Widget.Icon({ icon: iconMissing });
    } else {
      return new Widget.Label({ label: "?" });
    }
  }
};

type CustomIcon = IconProps & {
  icon2?: string;
};
