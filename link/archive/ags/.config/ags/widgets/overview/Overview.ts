import Gtk from "gi://Gtk?version=3.0";
import NotificationList from "./modules/NotificationList";
import QuickSettings from "./modules/QuickSettings";
import Sliders from "./modules/Sliders";
import CalendarX from "./modules/CalendarX";

const currentPage = Variable(0)

function Page1() {
   return Widget.Box({})
}

export default (monitor: number = 0) => {
   const createDotButton = (index: number) => {
      return Widget.Button({
         className: currentPage
            .bind()
            .as((v) =>
               v == index
                  ? "overview-stack-dotbutton active"
                  : "overview-stack-dotbutton"
            ),
         hexpand: false,
         label: "●",
         onClicked: () => currentPage.setValue(index),
      });
   };

   let pages = {
      page1: NotificationList(),
      page2: CalendarX(),
   };

   const numberOfPages = Object.keys(pages).length;
   const pageNames = Array.from(
      { length: numberOfPages },
      (_, i) => `page${i + 1}`
   );

   const stack = Widget.Stack({
      className: "overview-stack-area",
      hexpand: true,
      // @ts-expect-error
      shown: currentPage.bind().as((v) => `page${v + 1}`),
      transition: "slide_left_right",
      transitionDuration: 200,
      children: pages,
   });

   const dotButtons = pageNames.map((_, index) => createDotButton(index));

   const eventBox = Widget.EventBox({
      onScrollUp: () =>
         currentPage.setValue(
            Math.min(currentPage.value + 1, numberOfPages - 1)
         ),
      onScrollDown: () =>
         currentPage.setValue(Math.max(currentPage.value - 1, 0)),

      child: Widget.Box({
         orientation: Gtk.Orientation.VERTICAL,
         children: [
            stack,
            Widget.Box({
               className: "overview-dots-container",
               hpack: "center",
               children: dotButtons,
            }),
         ],

         setup: (self) => {
            for (let page in pageNames) {
               // @ts-expect-error
               self.keybind(`${Number(page.replace("page", "")) + 1}`, () => {
                  currentPage.setValue(Number(page.replace("page", "")));
               });
            }
         },
      }),
   });

   const wrapper = Widget.Box({
      className: "overview-stack-container",
      child: eventBox
   })

   return Widget.Window({
      monitor,
      name: `ags-overview`,
      anchor: ["top", "right", "bottom"],
      margins: [8, 8, 8, 8],
      visible: false,
      keymode: "exclusive",

      child: Widget.Box({
         className: "overview",
         vertical: true,
         children: [QuickSettings(), Sliders(), wrapper],

         setup: (self) =>
            self.keybind("Escape", () => App.closeWindow("ags-overview")),
      }),
   });
};
