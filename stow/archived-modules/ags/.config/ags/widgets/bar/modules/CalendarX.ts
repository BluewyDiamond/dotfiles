function getCurrentDateFormatted(): string {
   const now = new Date();

   const day = String(now.getDate()).padStart(2, "0");
   const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
   const year = String(now.getFullYear()).slice(-2); // Get the last two digits of the year

   return `${day}/${month}/${year}`;
}

const time = Variable("", {
   poll: [1000, getCurrentDateFormatted],
});

export default () => {
   const icon = Widget.Label({
      label: "",
   });

   const clock = Widget.Label({
      label: time.bind(),
   });

   return Widget.Box({
      className: "calendar-bar-module",
      children: [icon, clock],
   });
};
