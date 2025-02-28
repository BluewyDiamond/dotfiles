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
    read -P (set_color magenta)"INPUT => "(set_color yellow) $value
    echo $value
end

prompt "Choose keyboard layout to enable custom keyboard layout [1/2/3/...]"
prompt "1 == ANSI"
prompt "2 == ISO"
prompt "3 == ANSI EU"
prompt "4 == ISO EU"

set choice (input)

switch $choice
    case 1
        localectl set-keymap --no-convert colemak_dh_wide_custom_ansi
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_ansi
        prompt "Done!"
    case 2
        localectl set-keymap --no-convert colemak_dh_wide_custom_iso
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_iso
        prompt "Done!"
    case 3
        localectl set-keymap --no-convert colemak_dh_wide_custom_eu_ansi
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_eu_ansi
        prompt "Done!"
    case 4
        localectl set-keymap --no-convert colemak_dh_wide_custom_eu_iso
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_eu_iso
        prompt "Done!"
    case '*'
        prompt "Invalid Input (Unchanged)"
end
