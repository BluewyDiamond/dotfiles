#!/usr/bin/env fish

set script_name (basename (status --current-filename))
set mono_channel (amixer -D pulse get Master | grep "Mono:" | awk '{print $NF}')
set left_channel (amixer -D pulse get Master | grep "Front Left:" | awk '{print $NF}')
set right_channel (amixer -D pulse get Master | grep "Front Right:" | awk '{print $NF}')

if test "$mono_channel" = "[on]" -o "$left_channel" = "[on]" -o "$right_channel" = "[on]"
	amixer -D pulse set Master mute
else if test "$mono_channel" = "[off]" -o "$left_channel" = "[off]" -o "$right_channel" = "[off]"
	amixer -D pulse set Master unmute
else
	notify-send "$script_name" "Something went wrong!"
end
