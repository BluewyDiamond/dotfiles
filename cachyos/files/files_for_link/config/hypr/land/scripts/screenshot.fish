#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))
set file $HOME/media/screenshots/(date +"%Y-%m-%d_%H-%M-%S").png

if not which wayshot >/dev/null
    notify-send "$SCRIPT_NAME" "Wayshot not found..."
    return
end

if string match -i -q -- $argv[1] partial
    if not which slurp >/dev/null
        notify-send "$SCRIPT_NAME" "Slurp not found..."
        return
    end

    wayshot -f $file -s (slurp)
else
    wayshot -f $file
end
