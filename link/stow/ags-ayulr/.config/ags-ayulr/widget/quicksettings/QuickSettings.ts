import type Gtk from "gi://Gtk?version=3.0"
import { PowerProfileSelector, PowerProfileToggle, ProfileSelector, ProfileToggle } from "./widgets/PowerProfile"
import { Header } from "./widgets/Header"
import { Volume, Microphone, SinkSelector, AppMixer } from "./widgets/Volume"
import { Brightness } from "./widgets/Brightness"
import { DND } from "./widgets/DND"
import { DarkModeToggle } from "./widgets/DarkMode"
import { MicMute } from "./widgets/MicMute"
import { Media } from "./widgets/Media"
import PopupWindow from "widget/PopupWindow"
import options from "options"

const { bar, quicksettings } = options
const media = (await Service.import("mpris")).bind("players")
const layout = Utils.derive([bar.position, quicksettings.position], (bar, qs) =>
    `${bar}-${qs}` as const,
)

const Row = (
    toggles: Array<() => Gtk.Widget> = [],
    menus: Array<() => Gtk.Widget> = [],
) => Widget.Box({
    vertical: true,
    children: [
        Widget.Box({
            homogeneous: true,
            class_name: "row horizontal",
            children: toggles.map(w => w()),
        }),
        ...menus.map(w => w()),
    ],
})

const Settings = () => Widget.Box({
    vertical: true,
    class_name: "ags-quicksettings vertical",
    css: quicksettings.width.bind().as(w => `min-width: ${w}px;`),
    children: [
        Header(),
        Widget.Box({
            class_name: "sliders-box vertical",
            vertical: true,
            children: [
                Row(
                    [Volume],
                    [SinkSelector, AppMixer],
                ),
                Microphone(),
                Brightness(),
            ],
        }),
        Row(
            [DarkModeToggle],
        ),
        Row([MicMute, DND]),
        Widget.Box({
            visible: media.as(l => l.length > 0),
            child: Media(),
        }),
    ],
})

const QuickSettings = () => PopupWindow({
    name: "ags-quicksettings",
    exclusivity: "exclusive",
    transition: bar.position.bind().as(pos => pos === "top" ? "slide_down" : "slide_up"),
    layout: layout.value,
    child: Settings(),
})

export function setupQuickSettings() {
    App.addWindow(QuickSettings())
    layout.connect("changed", () => {
        App.removeWindow("ags-quicksettings")
        App.addWindow(QuickSettings())
    })
}
