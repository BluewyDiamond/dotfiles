import PopupWindow from "widget/PopupWindow";
import NotificationColumn from "./NotificationColumn";
import DateColumn from "./DateColumn";
import options from "options";

const { bar, datemenu } = options;
const pos = bar.position.bind();
const layout = Utils.derive(
   [bar.position, datemenu.position],
   (bar, qs) => `${bar}-${qs}` as const
);

const Settings = () =>
   Widget.Box({
      class_name: "ags-datemenu horizontal",
      vexpand: false,
      children: [
         NotificationColumn(),
         Widget.Separator({ orientation: 1 }),
         DateColumn(),
      ],
   });

const DateMenu = () =>
   PopupWindow({
      name: "ags-datemenu",
      exclusivity: "exclusive",
      transition: pos.as((pos) => (pos === "top" ? "slide_down" : "slide_up")),
      layout: layout.value,
      child: Settings(),
   });

export function setupDateMenu() {
   App.addWindow(DateMenu());
   layout.connect("changed", () => {
      App.removeWindow("ags-datemenu");
      App.addWindow(DateMenu());
   });
}
