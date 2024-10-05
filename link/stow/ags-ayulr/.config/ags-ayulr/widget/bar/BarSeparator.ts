import options from "options";

const { start, center, end } = options.bar.layout;
const { transparent, position } = options.bar;

export function BarSeparator(monitor: number) {
   return Widget.Window({
      monitor,
      class_name: "bar-separator",
      name: `ags-bar-separator${monitor}`,
      anchor: ["top", "left", "right"],
      exclusivity: "exclusive",
      layer: "top",

      child: Widget.Box({
         class_name: "bar-border",
         hexpand: true,
      }),
   });
}

export function BarSeparatorShadow(monitor: number) {
   return Widget.Window({
      monitor,
      class_name: "bar-separator-shadow",
      name: `ags-bar-separator-shadow${monitor}`,
      anchor: ["top", "bottom", "left", "right"],
      layer: "bottom",

      child: Widget.Box({
         class_name: "bar-border-shadow",
         expand: true,
      }),
   });
}
