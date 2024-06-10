#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename))

function main
    set options \
        "  Init Waybar" \
        "󰑤  Reload Waybar" \
        "󰑤  Cycle Profile"
    # Format entries for fuzzel dmenu.
    set dmenu_in
    for option in $options
        if test -z "$dmenu_in"
            set dmenu_in "$option"
        else
            set dmenu_in "$dmenu_in\n$option"
        end
    end

    # Run fuzzel in dmenu mode & save its output.
    set dmenu_out (echo -e "$dmenu_in" | fuzzel --dmenu --prompt="󰇘 Waybar dmenu ")

    switch "$dmenu_out"
        case "*Init Waybar"
            waybar
        case "*Reload Waybar"
            killall -SIGUSR2 waybar
            case"*Cycle Profile"
            ./cycle_waybar_profiles.fish
    end
end

# --------------------
main
