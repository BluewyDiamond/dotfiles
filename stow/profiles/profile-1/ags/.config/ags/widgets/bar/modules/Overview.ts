export default () => {
   const label = Widget.Label({
      label: "",
   });

   return Widget.Button({
      className: "overview",

      onClicked: () => {
         App.toggleWindow("ags-overview");
         // TODO: change label if overview is visible or not
      },

      child: label,
   });
};
