import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

const notifications = await Service.import("notifications")
const network = await Service.import("network")
const bluetooth = await Service.import("bluetooth")

const DummyButton = (text: string) => {
   return Widget.Button({
      hexpand: true,

      child: Widget.Label({
         label: text,
      }),
   });
}

const DNDButton = () => {
   return Widget.Button({
      hexpand: true,
      onClicked: () => notifications.dnd = !notifications.dnd,

      child: Widget.Label({
         truncate: "end",
         label: "  Do Not Disturb"
      }),

      setup: (self) =>
         self
            .hook(notifications, (self) => {
               self.toggleClassName("active", notifications.dnd)
            })
   })
}

const WifiIndicator = () => {
   return Widget.Box({
      css: "padding-left: 15px; padding-right: 15px; padding-top: 5px; padding-bottom: 5px;",
      children: [
         Widget.Box({
            visible: network.wifi.bind("enabled"),
            orientation: Gtk.Orientation.VERTICAL,
            children: [
               Widget.Box([
                  Widget.Label({
                     label: "Internet"
                  })
               ]),
               Widget.Label({
                  label: network.wifi.bind("ssid").as((ssid) => ssid || "Unknown"),
                  class_name: "ssid",
                  xalign: 0,
                  vpack: "center",
                  truncate: "end"
               })
            ]
         }),
         Widget.Label({
            visible: network.wifi.bind("enabled").as((enabled) => !enabled),
            label: "Internet"
         }),
      ]
   });
}

const WiredIndicator = () => {
   return Widget.Box({
      children: [
         Widget.Label({
            label: "Internet"
         })
      ]
   });
}

const NetworkErrorIndicator = () => {
   return Widget.Box({
      hpack: "center",

      child: Widget.Label({
         truncate: "end",
         label: "󰛵  No Information..."
      })
   })
}

const NetworkButton = () => {
   return Widget.Button({
      hexpand: true,

      child: Widget.Stack({
         children: {
            wifi: WifiIndicator(),
            wired: WiredIndicator(),
            error: NetworkErrorIndicator()
         },

         shown: network.bind("primary").as((p) => p || "error")
      })
   })
}

const BluetoothButton = () => {
   return Widget.Button({
      hexpand: true,
      onClicked: () => {},

      child: Widget.Label({
         label: "  Bluetooth"
      }),

      setup: (self) =>
         self
            .hook(bluetooth, (self) => {
               self.toggleClassName("active", bluetooth.enabled)
            })
   })
}

const currentPage = Variable(0);

function Page1() {
   return Widget.Box({
      hexpand: true,
      vertical: true,
      spacing: 8,
      children: [
         Widget.Box({
            spacing: 8,
            children: [NetworkButton(), BluetoothButton()],
         }),

         Widget.Box({
            spacing: 8,
            children: [DNDButton(), DummyButton("fourth")],
         }),
      ],
   });
}

const createDotButton = (index: number) => {
   return Widget.Button({
      className: currentPage
         .bind()
         .as((v) =>
            v == index
               ? "overview-quick-settings-dotbutton active"
               : "overview-quick-settings-dotbutton"
         ),
      hexpand: false,
      label: "●",
      onClicked: () => currentPage.setValue(index),
   });
};

export default () => {
   let pages = {
      page1: Page1(),
      page2: Page1(),
   };

   const numberOfPages = Object.keys(pages).length;
   const pageNames = Array.from(
      { length: numberOfPages },
      (_, i) => `page${i + 1}`
   );

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
               className: "overview-quick-settings-dots-container",
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

   return Widget.Box({
      className: "overview-quick-settings-container",
      child: eventBox,
   });
};
