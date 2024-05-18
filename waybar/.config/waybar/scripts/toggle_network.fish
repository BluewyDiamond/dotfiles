#!/usr/bin/env fish

set script_name (basename (status --curent-filename))
set net_status (nmcli networking)

if test "$net_status" = enabled
    nmcli networking off
else if test "$net_status" = disabled
    nmcli networking on
else
    notify-send "$script_name" "Something went wrong!"
end
