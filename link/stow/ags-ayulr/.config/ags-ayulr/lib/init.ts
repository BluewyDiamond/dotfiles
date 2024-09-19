import hyprland from "./hyprland"
import gtk from "./gtk"
import lowBattery from "./battery"
import notifications from "./notifications"

export default function init() {
    try {
        gtk()
        lowBattery()
        notifications()
        hyprland()
    } catch (error) {
        logError(error)
    }
}
