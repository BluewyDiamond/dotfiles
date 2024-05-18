#!/usr/bin/env fish

set playerctl (playerctl -a status ^/dev/null 2>&1)

if string match -rq "Playing" (echo "$playerctl") >/dev/null
    playerctl -p "spotify,*" metadata --format "󰎆  {{title}} - {{artist}}" ||
    playerctl metadata --format "󰎆  {{title}} - {{artist}}"
else
    echo -n "󱎫  "
    uptime | sed -E 's/^[^,]*up *//; s/, *[[:digit:]]* users?.*//; s/days/giorni/; s/day/giorno/; s/min/min./; s/([[:digit:]]+):0?([[:digit:]]+)/\1 h, \2 min/'
end
