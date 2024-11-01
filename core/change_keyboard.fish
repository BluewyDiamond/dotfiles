#!/usr/bin/env fish

set -g SCRIPT_NAME (basename (status -f))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) $value
    echo $value
end

prompt "Choose keyboard layout to enable custom keyboard layout [1/2/3/...]"
prompt "1 == ANSI"
prompt "2 == ISO"

set choice (input)

switch $choice
    case 1
        localectl set-keymap --no-convert colemak_dh_wide_custom_ansi
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_ansi
        prompt "Done!"
    case 2
        echo
        localectl set-keymap --no-convert colemak_dh_wide_custom_iso
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_iso
        prompt "Done!"
    case '*'
        prompt "Invalid Input (Unchanged)"
end
