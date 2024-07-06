import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

export const getIcon = (
   /** @type {string} */ clientClass: string,
   /** @type {string} */ clientTitle: string,
   /** @type {float} */ clientOpacity: number
) => {
   let icon: Gtk.IconInfo | null;
   let iconName: string | undefined;
   let formattedClientTitle: string | undefined;
   const fallbackIconName = {
      aladropterm: "Alacritty",
      alaupdate: "alaupdate",
      kittydropterm: "kitty",
      kittyupdate: "kitty",
      "code-url-handler": "vscode",
      kvantummanager: "kvantum",
      Rofi: "kappfinder",
      workspace: "vokoscreen",
   };

   iconName = fallbackIconName[clientClass]
      ? fallbackIconName[clientClass]
      : clientClass;

   icon = Utils.lookUpIcon(iconName);
   if (!icon) {
      icon = Utils.lookUpIcon(clientClass.toLowerCase());
      if (icon) iconName = clientClass.toLowerCase();
   }
   if (!icon) {
      icon = Utils.lookUpIcon(`${clientClass}-symbolic`);
      if (icon) iconName = `${clientClass}-symbolic`;
   }
   if (!icon) {
      formattedClientTitle = clientTitle.toLowerCase().replace(/ /g, "-");
      icon = Utils.lookUpIcon(formattedClientTitle);
      if (icon) iconName = formattedClientTitle;
   }
   if (!icon) {
      formattedClientTitle = `${clientTitle
         .toLowerCase()
         .replace(/ /g, "-")}-symbolic`;
      icon = Utils.lookUpIcon(formattedClientTitle);
      if (icon) iconName = formattedClientTitle;
   }
   if (!icon) {
      iconName = "xfce-unknown";
   }

   return Widget.Icon({ icon: iconName, css: `opacity: ${clientOpacity}` });
};
