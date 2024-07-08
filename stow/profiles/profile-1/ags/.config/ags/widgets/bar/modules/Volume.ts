import padNumberWithSpaces from "libs/utils/padNumberWithSpaces";

const audio = await Service.import("audio");

export default () => {
   const icons = {
      101: "",
      67: "󰕾",
      34: "󰖀",
      1: "󰕿",
      0: "󰖁",
   };

   function getIcon() {
      const icon = audio.speaker.is_muted
         ? 0
         : [101, 67, 34, 1, 0].find(
              (threshold) => threshold <= Math.round(audio.speaker.volume * 100)
           );

      return icons[icon] || "󰓃";
   }

   const icon = Widget.Label({
      label: Utils.watch(getIcon(), audio.speaker, getIcon),
   });

   const label = Widget.Label({
      label: Utils.watch(
         padNumberWithSpaces(Math.round(audio.speaker.volume * 100), 3, " "),
         audio.speaker,
         () =>
            padNumberWithSpaces(Math.round(audio.speaker.volume * 100), 3, " ")
      ),
   });

   return Widget.EventBox({
      onScrollUp: () => {
         audio.speaker.volume =
            Math.round(audio.speaker.volume * 100) / 100 + 0.01;
      },

      onScrollDown: () => {
         audio.speaker.volume =
            Math.round(audio.speaker.volume * 100) / 100 - 0.01;
      },

      child: Widget.Box({
         class_name: "volume",
         children: [icon, label],
      }),
   });
};
