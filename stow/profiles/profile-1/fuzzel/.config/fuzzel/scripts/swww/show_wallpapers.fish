#!/usr/bin/env fish

set -g WALLPAPERS

function main
    # Collects an array of files from specified path.
    handle_arguments $argv

    # Format entries for dmenu.
    set dmenu_in
    for wallpaper in $WALLPAPERS
        # Show only wallpaper name instead of full path.
        set wallpaper (basename $wallpaper)

        if test -z "$dmenu_in"
            set dmenu_in "$wallpaper"
        else
            set dmenu_in "$dmenu_in\n$wallpaper"
        end
    end

    # Run fuzzel in dmenu mode & save its output.
    set dmenu_out (echo -e "$dmenu_in" | fuzzel --dmenu --index --prompt="󰩷  Select Wallpaper ")

    set effects fade left right top bottom wipe wave grow center any outer
    set array_length (count $effects)
    set random_index (random 1 $array_length)
    set random_value $effects[$random_index]

    # Exit if dmenu output is empty.
    if test -z (string trim -l -r "$dmenu_out")
        exit 1
    end

    # Arrays in fish starts at index 1 instead of 0.
    set index (math $dmenu_out + 1)

    # Change wallpaper.
    swww img --transition-fps 240 --transition-type $random_value $WALLPAPERS[$index]
end

function handle_arguments
    if test (count $argv) -eq 0
        echo "Simple script that cycles wallpapers using swww"
        echo ""
        echo "Usage: SCRIPT <OPTION>"
        echo ""
        echo "Available Options:"
        echo "    --wallpapers-path <PATH>"

        exit 1
    end

    if string match -q -- --wallpapers-path "$argv[1]"
        if test -z "$argv[2]"
            echo "No path specified..."
            exit 1
        end

        eval set -g WALLPAPERS "$argv[2]/*"
    end
end

# --------------------
main $argv
