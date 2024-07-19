const audio = await Service.import("audio");
const network = await Service.import("network");
const notifications = await Service.import("notifications");
const bluetooth = await Service.import("bluetooth");

const MicrophoneIndicator = () => {
   return Widget.Label({
      visible: false,
      label: "",

      setup: (self) =>
         self.hook(audio, (self) => {
            self.visible =
               audio.recorders.length > 0 && !audio.microphone.is_muted && audio.microphone.volume > 0;
            updateParentVisibility();
         }),
   });
};

const NetworkIndicator = () => {
   return Widget.Label({
      visible: false,
      label: "󰛵",

      setup: (self) =>
         self.hook(network, (self) => {
            const networkConnectionType = network.primary;

            const icons: { [key: string]: string } = {
               wired: "󰈀",
               wifi: "",
            };

            const defaultIcon = "󰛵";

            if (networkConnectionType == null) {
               self.visible = false;
               updateParentVisibility();
               return;
            }

            const icon = icons[networkConnectionType] || defaultIcon;
            self.label = icon;
            self.visible = true;
            updateParentVisibility();
         }),
   });
};

const DNDIndicator = () =>
   Widget.Label({
      visible: false,
      label: "",

      setup: (self) =>
         self.hook(notifications, (self) => {
            self.visible = notifications.dnd;
            updateParentVisibility();
         }),
   });

const BluetoothIndicator = () =>
   Widget.Label({
      visible: false,
      label: "",

      setup: (self) =>
         self.hook(bluetooth, (self) => {
            self.visible = bluetooth.enabled;
            updateParentVisibility();
         }),
   });

const AudioIndicator = () =>
   Widget.Label({
      visible: false,
      label: "",

      setup: (self) =>
         self.hook(audio, (self) => {
            self.visible =
               audio.speakers.length > 0 &&
               !audio.speaker.is_muted &&
               audio.speaker.volume > 0;
            updateParentVisibility();
         }, "speaker-changed"),
   });

const NotificationsIndicator = () => {
   return Widget.Label({
      visible: false,
      label: "󱅫",

      setup: (self) => 
         self
         .hook(notifications, (self) => {
            self.visible = notifications.notifications.length > 0;
            updateParentVisibility();
         }, "notified")
         .hook(notifications, (self) => {
            self.visible = notifications.notifications.length > 0;
            updateParentVisibility();
         }, "closed")
   });
};

const indicatorsBarModule = Widget.Box({
   className: "indicators-bar-module",
   visible: false,
   spacing: 8,
   children: [
      MicrophoneIndicator(),
      AudioIndicator(),
      BluetoothIndicator(),
      DNDIndicator(),
      NetworkIndicator(),
      NotificationsIndicator(),
   ],
});

function updateParentVisibility() {
   if (indicatorsBarModule) {
      const allChildrenInvisible = indicatorsBarModule.children.every(
         (child: any) => !child.visible
      );

      indicatorsBarModule.visible = !allChildrenInvisible;
   }
}

export default () => {
   return indicatorsBarModule;
};
