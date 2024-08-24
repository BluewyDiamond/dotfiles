import padNumberWithSomething from "libs/utils/padNumberWithSomething";

const audio = await Service.import("audio");

const VolumeSlider = () =>
   Widget.Slider({
      hexpand: true,
      drawValue: false,
      min: 0,
      max: 1,
      value: audio.speaker.volume,
      on_change: ({ value }) => (audio.speaker.volume = value),
   });

export const Volume = () =>
   Widget.Box({
      hexpand: true,
      spacing: 8,
      children: [
         Widget.Button({
            on_clicked: () =>
               (audio.speaker.is_muted = !audio.speaker.is_muted),

            child: Widget.Label({
               label: "",

               setup: (self) =>
                  self.hook(audio, (self) => {
                     if (audio.speaker.is_muted) {
                        self.label = "󰖁";
                     } else {
                        self.label = "";
                     }
                  }),
            }),
         }),

         VolumeSlider(),

         Widget.Label({
            label: `${audio.speaker.volume}`,

            setup: (self) =>
               self.hook(audio.speaker, (self) => {
                  self.label = `${padNumberWithSomething(Math.round(audio.speaker.volume * 100), 3, " ")}`;
               }),
         }),
      ],
   });

const MicVolume = () => {
   const MicVolumeSlider = () => {
      return Widget.Slider({
         hexpand: true,
         drawValue: false,
         min: 0,
         max: 1,
         value: audio.microphone.volume,
         onChange: ({ value }) => (audio.microphone.volume = value),
      });
   };

   return Widget.Box({
      hexpand: true,
      spacing: 8,
      children: [
         Widget.Button({
            onClicked: () => {
               audio.microphone.is_muted = !audio.microphone.is_muted
            },

            child: Widget.Label({
               label: "",
            }),

            setup: (self) =>
               self
                  .hook(audio.microphone, (self) => {
                     if (audio.microphone.is_muted) {
                        self.child.label = ""
                     } else {
                        self.child.label = ""
                     }
                  })
         }),

         MicVolumeSlider(),

         Widget.Label({
            label: `${Math.round(audio.microphone.volume * 100)}`,

            setup: (self) => {
               self.hook(audio.microphone, (self) => {
                  self.label = `${Math.round(audio.microphone.volume * 100)}`;
               });
            },
         }),
      ],
   });
};

export default () => {
   return Widget.Box({
      className: "overview-sliders-container",
      hexpand: true,
      vertical: true,
      spacing: 8,
      children: [Volume(), MicVolume()],
   });
};
