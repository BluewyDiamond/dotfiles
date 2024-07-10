import padNumberWithSpaces from "libs/utils/padNumberWithSomething";

const audio = await Service.import("audio");

const VolumeSlider = () =>
   Widget.Slider({
      hexpand: true,
      css: "min-height: 4px",
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
            vpack: "center",
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
               self.hook(audio, (self) => {
                  self.label = `${padNumberWithSpaces(Math.round(audio.speaker.volume * 100), 3, " ")}`;
               }),
         }),
      ],
   });

export default () => {
   return Widget.Box({
      className: "overview-sliders-container",
      hexpand: true,
      children: [Volume()],
   });
};
