const audio = await Service.import("audio");
const network = await Service.import("network");

const MicrophoneIndicator = () =>
   Widget.Icon()
      .hook(
         audio,
         (self) =>
            (self.visible =
               audio.recorders.length > 0 || audio.microphone.is_muted || false)
      )
      .hook(audio.microphone, (self) => {
         const vol = audio.microphone.is_muted ? 0 : audio.microphone.volume;
         self.icon = "";
      });

const NetworkIndicator = () =>
   Widget.Icon().hook(network, (self) => {
      const icon = network[network.primary || "wifi"]?.icon_name;
      self.icon = icon || "";
      self.visible = !!icon;
   });
