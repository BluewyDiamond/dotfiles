#!/usr/bin/env fish

set script_name (basename (status filename))

if pidof obs
    set hyprctl_output (hyprctl dispatch sendshortcut ',F1, class:com.obsproject.Studio')

    # because hyprctl fail does not change the status
    if not string match -q -r ok $hyprctl_output
        notify-send "$script_name" "ERROR: $hyprctl_output"
        exit 1
    end

    notify-send "$script_name" "Sent clip signal."
else
    notify-send "$script_name" "OBS is not running... Unable to clip."
end
