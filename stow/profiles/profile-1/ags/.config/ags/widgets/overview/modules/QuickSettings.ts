import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

function button(text: string) {
   return Widget.Button({
      hexpand: true,
      // className: "overview-setting",
      css: "min-height: 50px",

      child: Widget.Label({
         label: text,
      }),
   });
}

export default () => {
   return Widget.Box({
      className: "overview-quick-settings-container",
      hexpand: true,
      vertical: true,
      spacing: 8,
      children: [
         Widget.Box({
            spacing: 8,
            children: [button("first"), button("second")],
         }),

         Widget.Box({
            spacing: 8,
            children: [button("third"), button("fourth")],
         }),
      ],
   });
};
