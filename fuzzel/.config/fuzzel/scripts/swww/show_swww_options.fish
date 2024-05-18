#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename))

function main
    set options \
        "  Init swww" \
        "󰑤  Cycle Wallpaper" \
        "󰋹  Select Wallpaper"

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
    set dmenu_out (echo -e "$dmenu_in" | fuzzel --dmenu --prompt="󰇘  Swww dmenu ")

    switch "$dmenu_out"
        case "*Init swww"
            swww init
        case "*Cycle Wallpaper"
            $HOME/.config/swww/scripts/cycle_wallpaper.fish --wallpapers-path $HOME/pictures
        case "*Select Wallpaper"
            $HOME/.config/fuzzel/scripts/swww/show_wallpapers.fish --wallpapers-path $HOME/pictures/wallpapers
    end
end

# --------------------
main
