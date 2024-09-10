#!/usr/bin/env fish

echo "script: What is your default keyboard layout type?"
echo "1. ANSI"
echo "2. ISO"

read -P "script => Input -- " choice

switch $choice
    case 1
        echo
        localectl set-keymap --no-convert colemak_dh_wide_custom_ansi
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_ansi
    case 2
        echo
        localectl set-keymap --no-convert colemak_dh_wide_custom_iso
        localectl set-x11-keymap --no-convert bluewy colemak_dh_wide_custom_iso
end
