#!/usr/bin/env fish

sudo cp (dirname (status -f))/./usr/share/X11/xkb/symbols/bluewy /usr/share/X11/xkb/symbols
sudo cp (dirname (status -f))/./usr/share/kbd/keymaps/colemak_dh_wide_custom_iso.map.gz /usr/share/kbd/keymaps
sudo cp (dirname (status -f))/./usr/share/kbd/keymaps/colemak_dh_wide_custom_ansi.map.gz /usr/share/kbd/keymaps

# prepare fish config directory
rm -r $HOME/.config/fish
mkdir $HOME/.config/fish
mkdir $HOME/.config/conf.d
mkdir $HOME/.config/functions
mkdir $HOME/.config/themes
