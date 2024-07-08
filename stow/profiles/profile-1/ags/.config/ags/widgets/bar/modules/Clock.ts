const time = Variable("", {
   poll: [1000, 'date "+%H:%M"'],
});

export default () => {
   const icons = {
      1: "󱑋",
      2: "󱑌",
      3: "󱑍",
      4: "󱑎",
      5: "󱑏",
      6: "󱑐",
      7: "󱑑",
      8: "󱑒",
      9: "󱑓",
      10: "󱑔",
      11: "󱑕",
      12: "󱑖",
      13: "󱐿",
      14: "󱑀",
      15: "󱑁",
      16: "󱑂",
      17: "󱑃",
      18: "󱑄",
      19: "󱑅",
      20: "󱑆",
      21: "󱑇",
      22: "󱑈",
      23: "󱑉",
      24: "󱑊",
   };

   function getIcon(): string {
      const hour = parseInt(time.value.split(":")[0]);
      return icons[hour] || "󱡦";
   }

   const icon = Widget.Label({
      label: Utils.watch(getIcon(), time, getIcon),
   });

   const clock = Widget.Label({
      label: time.bind(),
   });

   return Widget.Box({
      className: "clock",
      children: [icon, clock],
   });
};
