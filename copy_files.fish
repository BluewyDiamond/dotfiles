#!/usr/bin/env fish

sudo cp (dirname (status -f))/./copy/usr/share/X11/xkb/symbols/bluewy /usr/share/X11/xkb/symbols
sudo cp (dirname (status -f))/./copy/usr/share/kbd/keymaps/colemak_dh_wide_custom_iso.map /usr/share/kbd/keymaps
sudo cp (dirname (status -f))/./copy/usr/share/kbd/keymaps/colemak_dh_wide_custom_ansi.map /usr/share/kbd/keymaps

cp (dirname (status -f))/./copy/home/user-dirs.dirs $HOME/.config
