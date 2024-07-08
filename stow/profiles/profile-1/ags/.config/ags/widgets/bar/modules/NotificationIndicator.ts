export default () => {
    const label = Widget.Label({
        label: "+"
    })

    return Widget.Button({
        className: "notification-indicator",
        onClicked: () => {
            App.toggleWindow("ags-overview")
        },
        child: label
    })
}