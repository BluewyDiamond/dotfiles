import NotificationList from "./modules/NotificationList"

export default (monitor: number = 0) => {

    return Widget.Window({
        monitor,
        name: `ags-overview`,
        anchor: ["right"],
        margins: [8, 8, 8, 8],
        visible: false,

        child: Widget.Box({ 
            className: "overview",
            children: [NotificationList()] })
    })
}