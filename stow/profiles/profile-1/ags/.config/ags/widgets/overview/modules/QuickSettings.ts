function row() {
   return Widget.Button({
      className: "setting",
      css: "min-width: 2px; min-height: 2px;",
      child: Widget.Label({
         label: "placeholder",
      }),
   });
};

export default () => {
   const column1 = Widget.Box({
      vertical: true,
      hexpand: true,
      children: [row(), row(), row()]
   })

 const column2 = Widget.Box({
      vertical: true,
      hexpand: true,
      children: [row(), row(), row()]
   })

   return Widget.Box({
      className: "quick-settings-container",
      hexpand: true,
      children: [column1, column2]
   });
};
