#!/usr/bin/env fish

function scan
    set default_value $argv[1]
    set label $argv[2]

    read -P "$label" input

    if test -z "$input"
        echo $default_value
        return
    end

    echo $input
end
