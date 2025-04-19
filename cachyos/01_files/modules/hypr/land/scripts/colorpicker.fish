#!/usr/bin/env fish

set the_script (realpath (status --current-filename))

set hyprpicker_output (hyprpicker; or notify-send "$the_script" "Failed, status code non zero!")
wl-copy $hyprpicker_output
notify-send "$the_script" "Copied $hyprpicker_output to clipboard."
