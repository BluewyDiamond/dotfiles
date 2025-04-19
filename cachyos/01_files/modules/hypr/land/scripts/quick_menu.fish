#!/usr/bin/env fish

set options "󰹑 Screenshot" \
    "󰆞 Screenshot (Region)" \
    " Color Pick"

set selected_option (string join \n $options | fuzzel --dmenu --index && sleep 0.5 ) # adds a delay to allow fuzzel to close
set selected_option (math $selected_option + 1)

set current_dir (dirname (realpath (status --current-filename)))

switch $selected_option
    case 1
        $current_dir/screenshot.fish
    case 2
        $current_dir/screenshot.fish partial
    case 3
        $current_dir/colorpicker.fish
end
