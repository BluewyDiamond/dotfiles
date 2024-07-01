#!/usr/bin/env fish

set -g CURRENT_NAME (basename (status --current-filename) | string split -r '.' | head -n 1)
set -g CURRENT_FULL_NAME (basename (status --current-filename))
set -g HISTORY_FILE_PATH $HOME/.cache/$CURRENT_NAME

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

    set option_grimblast "󰹑  Grimblast (Screenshot)"

    if which grimblast >/dev/null
        set raw_options $raw_options $option_grimblast
    end

    set options $raw_options

    set sorted_entries_output (sort_menu_entries_3 $options)
    set sorted_entries (string split "\n" $sorted_entries_output)

    # Format entries for fuzzel dmenu.
    set dmenu_in

    for option in $sorted_entries
        if test -z "$dmenu_in"
            set dmenu_in "$option"
        else
            set dmenu_in "$dmenu_in\n$option"
        end
    end

    # Run fuzzel in dmenu mode & save its output.
    set dmenu_out (echo -e $dmenu_in | fuzzel --dmenu --prompt="  Quick Access ")

    switch $dmenu_out
        case $option_swww
            $HOME/.config/fuzzel/scripts/swww/show_swww_options.fish
        case $option_waybar
            $HOME/.config/fuzzel/scripts/waybar/show_waybar_options.fish
        case $option_hyprpaper
            $HOME/.config/fuzzel/scripts/hyprpaper/show_hyprpaper_options.fish
        case $option_grimblast
            $HOME/.config/fuzzel/scripts/grimblast/show_grimblast_options.fish
        case '*'
            echo "script: not an option..."
            notify-send "$CURRENT_NAME" "<span color='#E06C75'>This option has not yet been implemented.</span>"
            exit 1
    end

    # Write saved output to file.
    increment_key_value $dmenu_out
end

function sort_menu_entries_3
    # Path to the file containing key-value pairs.
    set file_path $HISTORY_FILE_PATH

    # Declare lists to hold keys and values.
    set kv_keys
    set kv_values

    # Read the file line by line.
    for line in (cat $file_path)
        # Split each line by ':' to get key and value.
        set key (echo $line | cut -d':' -f1)
        set value (echo $line | cut -d':' -f2)

        # Add the key and value to the lists.
        set kv_keys $kv_keys $key
        set kv_values $kv_values $value
    end

    # Initialize the options you set.
    set raw_options $argv

    # Create a list to store the options with their counts.
    set option_counts

    # Check if each option exists in the key-value pairs; if not, set to 0.
    for option in $raw_options
        set found 0
        for i in (seq (count $kv_keys))
            if test $kv_keys[$i] = $option
                set option_counts $option_counts "$kv_values[$i]:$option"
                set found 1
                break
            end
        end
        if test $found -eq 0
            set option_counts $option_counts "0:$option"
        end
    end

    # Sort the options based on their counts in descending order.
    set sorted_options (for count_option in $option_counts
        echo $count_option
    end | sort -t':' -k1,1nr | cut -d':' -f2)

    # Print the sorted options (for debugging purposes).
    for index in $sorted_options
        echo $index
    end
end

function increment_key_value
    set key_to_find $argv[1]
    set file_path $HISTORY_FILE_PATH

    # Check if the file exists
    if test -f $file_path
        # Use grep to find the line containing the key
        set line (grep $key_to_find $file_path)

        # Check if grep found a matching line
        if test -n "$line"
            # Extract the current value associated with the key
            set current_value (echo $line | awk -F ':' '{print $2}')
            set new_value (math $current_value + 1)

            # Replace the old value with the new value in the file
            sed -i "s/^$key_to_find:$current_value\$/$key_to_find:$new_value/" $file_path

            echo "Updated $key_to_find to $new_value"
        else
            # Key not found, append it to the file
            set new_value 1 # Start with 1 if key is new
            echo "$key_to_find:$new_value" >>$file_path
            echo "Added new key $key_to_find with value $new_value"
        end
    else
        # File does not exist, create it and add the key-value pair
        set new_value 1 # Start with 1 if file is new
        echo "$key_to_find:$new_value" >$file_path
        echo "Created new file $file_path with key $key_to_find and value $new_value"
    end
end

# --------------------
main
