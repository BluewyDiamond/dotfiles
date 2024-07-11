#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename))

function main
    set options

    set option1 "  Init Hyprpaper"
    set options $option1

    set dmenu_in
    for option in $options
        if test -z "$dmenu_in"
            set dmenu_in "$option"
        else
            set dmenu_in "$dmenu_in\n$option"
        end
    end

    # Run fuzzel in dmenu mode & save its output.
    set dmenu_out (echo -e "$dmenu_in" | fuzzel --dmenu --prompt="󰇘  Hyprpaper dmenu ")

    switch "$dmenu_out"
        case "$option1"
            hyprpaper
        case ""

        case "*"
            echo "script: not an option..."
            notify-send "$CURRENT_NAME" "<span color='#E06C75'>not an option....</span>"
            exit 1
    end
end

# --------------------
main
