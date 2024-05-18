#!/usr/bin/env fish

set focused_window_id (hyprctl activewindow | awk '/pid:/ {print $2}')

set non_focused_windows

if test -z $focused_window_id
    set non_focused_windows (hyprctl clients -j | jq -r ".[] | select(.pid != -1) | [ .class, .title, .pid ] | join(\" => \")")
else
    set non_focused_windows (hyprctl clients -j | jq -r ".[] | select(.pid != -1 and .pid != $focused_window_id) | [ .class, .title, .pid ] | join(\" => \")")
end

set dmenu_input

for window in $non_focused_windows
    set parts (string split "=>" "$window")
    set new_string (string join "=>" $parts[1..-2])

    if test -n "$dmenu_input"
        set dmenu_input "$dmenu_input\n$new_string"

        continue
    end

    set dmenu_input $new_string
end

set dmenu_input "Previous or Current Window\n$dmenu_input"

set dmenu_output (echo -en $dmenu_input | fuzzel --dmenu --index --prompt="  Windows ")

if test -z $dmenu_output
    return 1
end

# add 1 cause in fish shell arrays start with 1
set index (math $dmenu_output + 1)

if test $index -eq 1
    hyprctl dispatch focuscurrentorlast
    return
end

# subtract 1 because of custom option
set index (math $index - 1)

echo "$non_focused_windows[$index]" |
    awk '{print $NF}' |
    while read -l id
        hyprctl dispatch focuswindow pid:$id
    end
