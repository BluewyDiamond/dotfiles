#!/usr/bin/env fish

set SCRIPT_NAME (basename (status -f))

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

sudo cp (dirname (status -f))/cp_files/xkb/bluewy /usr/share/X11/xkb/symbols
sudo cp (dirname (status -f))/cp_files/kbd/colemak_dh_wide_custom_iso.map /usr/share/kbd/keymaps
sudo cp (dirname (status -f))/cp_files/kbd/colemak_dh_wide_custom_ansi.map /usr/share/kbd/keymaps
