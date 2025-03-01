#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))

if not which hyprpicker
    notify-send "$SCRIPT_NAME" "hyprpicker not found..."
end

set rgb (hyprpicker)
echo $rgb | wl-copy

notify-send "$SCRIPT_NAME" "Copied $rgb to clipboard."
