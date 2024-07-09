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

const currentPage = Variable(0)

function page1() {
   return Widget.Box({
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
}

const createDotButton = (index: number) => {
   return Widget.Button({
      className: currentPage.bind().as((v) => (v == index ? "dotbutton active" : "dotbutton")),
      hexpand: false,
      label: "●",
      onClicked: () => currentPage.setValue(index),
   });
}

export default () => {
   let pages = {
      page1: page1(),
      page2: page1()
   }

   const numberOfPages = Object.keys(pages).length;
   const pageNames = Array.from({ length: numberOfPages }, (_, i) => `page${i + 1}`);

   const stack = Widget.Stack({
      className: "overview-quick-settings-area",
      hexpand: true,
      // @ts-expect-error
      shown: currentPage.bind().as((v) => `page${v + 1}`),
      transition: "slide_left_right",
      transitionDuration: 200,
      children: pages,
   });

   const dotButtons = pageNames.map((_, index) => createDotButton(index));

   const eventBox = Widget.EventBox({
      onScrollUp: () => currentPage.setValue(Math.min(currentPage.value + 1, numberOfPages - 1)),
      onScrollDown: () => currentPage.setValue(Math.max(currentPage.value - 1, 0)),

      child: Widget.Box({
         orientation: Gtk.Orientation.VERTICAL,
         children: [
            stack,
            Widget.Box({
               className: "overview-quick-settings-dots-container",
               hpack: "center",
               children: dotButtons,
            })
         ],

         setup: (self) => {
            for (let page in pageNames) {
               // @ts-expect-error
               self.keybind(`${Number(page.replace("page", "")) + 1}`, () => {
                  currentPage.setValue(Number(page.replace("page", "")));
               });
            }
         }
      })
   });

   return Widget.Box({
      className: "overview-quick-settings-container",
      child: eventBox
   })
};
