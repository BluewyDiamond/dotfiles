#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename))
set -g HISTORY_FILE_PATH $HOME/.cache/quick_access_history.txt
set -g SORTED_ENTRIES

function main
    set raw_options

    set option_hyprpaper "󰸉  Hyprpaper (Wallpaper)"

    if which hyprpaper >/dev/null
        set raw_options $raw_options $option_hyprpaper
    end

    set option_swww "󰸉  Swww (Wallpaper)"

    if which swww >/dev/null
        set raw_options $raw_options $option_swww
    end

    set option_waybar "󰜬  Waybar"

    if which waybar >/dev/null
        set raw_options $raw_options $option_waybar
    end

    set options $raw_options

    sort_menu_entries $options

    # Format entries for fuzzel dmenu.
    set dmenu_in

    for option in $SORTED_ENTRIES
        if test -z "$dmenu_in"
            set dmenu_in "$option"
        else
            set dmenu_in "$dmenu_in\n$option"
        end
    end

    # Run fuzzel in dmenu mode & save its output.
    set dmenu_out (echo -e $dmenu_in | fuzzel --dmenu --prompt="  Quick Access ")

    # Write saved output to file.
    echo "$dmenu_out" >>"$HISTORY_FILE_PATH"

    switch "$dmenu_out"
        case "$option_swww"
            $HOME/.config/fuzzel/scripts/swww/show_swww_options.fish
        case "$option_waybar"
            $HOME/.config/fuzzel/scripts/waybar/show_waybar_options.fish
        case "$option_hyprpaper"
            $HOME/.config/fuzzel/scripts/hyprpaper/show_hyprpaper_options.fish
        case '*'
            notify-send "$CURRENT_NAME" "<span color='#E06C75'>This option has not yet been implemented.</span>"
    end
end

function sort_menu_entries
    # In the case of no history file
    # it will default to raw entries order.
    if not test -e $HISTORY_FILE_PATH
        set SORTED_ENTRIES $argv

        return
    end

    # Read history file & order saved entries & store it in an array.
    set simplified_history
    cat $HISTORY_FILE_PATH | sort | uniq -c | sort -rn | awk -F' ' '{print $2 "  " $3}' | while read -l line
        set simplified_history $simplified_history $line
    end

    set options $argv

    # Verify validity & reuse values in said array.
    set tmp
    for simp in $simplified_history
        for option in $options
            echo "Debug: $simp ?= $option"
            if string match -q -- "$simp" "$option"
                set tmp $tmp $option
            end
        end
    end

    # Save possible missing entries in an array.
    set tmp2
    for option in $options
        if not contains $option $tmp
            set tmp2 $tmp2 $option
        end
    end

    # Fuse reused values in an array & possible missing entries in an array.
    set tmp3 $tmp
    set tmp3 $tmp3 $tmp2

    set SORTED_ENTRIES $tmp3
end

# --------------------
main
