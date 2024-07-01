#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename))

function main
    set options

    set option_screenshot_all "󰍺  Screenshot All"
    set options $options $option_screenshot_all

    set option_screenshot_active_monitor "󰍹  Screenshot Active Monitor"
    set options $options $option_screenshot_active_monitor

    set option_screenshot_active_window "  Screenshot Active Window"
    set options $options $option_screenshot_active_window

    set option_screenshot_area "󰹑  Screenshot Area"
    set options $options $option_screenshot_area

    set dmenu_in

    for option in $options
        if test -z "$dmenu_in"
            set dmenu_in "$option"
        else
            set dmenu_in "$dmenu_in\n$option"
        end
    end

    set dmenu_out (echo -e "$dmenu_in" | fuzzel --dmenu --prompt="󰇘  Grimblast dmenu ")

    switch "$dmenu_out"
        case $option_screenshot_all
            grimblast --notify copysave screen
        case $option_screenshot_active_monitor
            grimblast --notify copysave output
        case $option_screenshot_active_window
            grimblast --notify copysave active
        case $option_screenshot_area
            grimblast --notify copysave area
        case ""

        case "*"
            echo "script: not an option"
            notify-send "$CURRENT_NAME" "not an option..."
            exit 1
    end
end

# --------------------
main
