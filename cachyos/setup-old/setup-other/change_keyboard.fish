#!/usr/bin/env fish

source ../setup-utils/lib.fish

set script_name (basename (status filename))

echo "Choose keyboard layout to enable custom keyboard layout [1/2/3/...]"
echo "1 == ANSI"
echo "2 == ISO"
echo "3 == ANSI EU"
echo "4 == ISO EU"

set choice (scan '' (set_color magenta)'INPUT: '(set_color normal))

switch $choice
    case 1
        localectl set-keymap --no-convert colemak_dh_wide_custom_ansi
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_ansi
    case 2
        localectl set-keymap --no-convert colemak_dh_wide_custom_iso
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_iso
    case 3
        localectl set-keymap --no-convert colemak_dh_wide_custom_eu_ansi
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_eu_ansi
    case 4
        localectl set-keymap --no-convert colemak_dh_wide_custom_eu_iso
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_eu_iso
    case '*'
        echo (set_color red)"ERROR: "(set_color normal)"Invalid value... |choice=$choice|"
end
