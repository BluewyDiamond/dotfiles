#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename))

function main
    set options

    set option_init"  Init swww"
    set options $options $option_init

    set option_cycle "󰑤  Cycle Wallpaper"
    set options $options $option_cycle

    set option_select_wallpaper "󰋹  Select Wallpaper"
    set options $options $option_select_wallpaper

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
        case $option_init
            swww init
        case $option_cycle
            $HOME/.config/swww/scripts/cycle_wallpaper.fish --wallpapers-path $HOME/media/wallpapers
        case $option_select_wallpaper
            $HOME/.config/fuzzel/scripts/swww/show_wallpapers.fish --wallpapers-path $HOME/media/wallpapers
        case ""

        case "*"
            echo "script: not an option..."
            notify-send "$CURRENT_NAME" "<span color='#E06C75'>not an option...</span>"
            exit 1
    end
end

# --------------------
main
