#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z $value
        set value $argv[1]
    end

    echo $value
end

sudo cp (dirname (status filename))/files_for_cp/xkb/* /usr/share/X11/xkb/symbols
sudo cp (dirname (status filename))/files_for_cp/kbd/* /usr/share/kbd/keymaps
