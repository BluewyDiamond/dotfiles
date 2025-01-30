#!/usr/bin/env fish

set uptime_output (uptime | sed -E 's/^[^,]*up *//; s/, *[[:digit:]]* users?.*//; s/days/giorni/; s/day/giorno/; s/min/min./; s/([[:digit:]]+):0?([[:digit:]]+)/\1 h, \2 min/')

if test -z $uptime_output
   echo "failed to fetch uptime..."
   exit 1
end

echo -n "󱎫 "
echo $uptime_output
