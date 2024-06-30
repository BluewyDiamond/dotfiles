#!/usr/bin/env fish

set script_name (basename (status --current-filename))

if not which pactl
   notify-send "$script_name" "pactl not found"
   exit 1
end

if not pactl set-sink-mute @DEFAULT_SINK@ toggle
    notify-send "$script_name" "something went wrong"
    exit 1
end
