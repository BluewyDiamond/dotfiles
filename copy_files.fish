#!/usr/bin/env fish

sudo cp (dirname (status -f))/./copy/usr/share/X11/xkb/symbols/bluewy /usr/share/X11/xkb/symbols
sudo cp (dirname (status -f))/./copy/usr/share/kbd/keymaps/colemak_dh_wide_custom_iso.map.gz /usr/share/kbd/keymaps
sudo cp (dirname (status -f))/./copy/usr/share/kbd/keymaps/colemak_dh_wide_custom_ansi.map.gz /usr/share/kbd/keymaps
