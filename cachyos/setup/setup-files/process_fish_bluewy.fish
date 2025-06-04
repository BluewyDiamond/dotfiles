#!/usr/bin/env fish

source ./process.fish

process false link (./get_working_dir.fish)/fish_bluewy $HOME/.config/fish_bluewy
echo "source $HOME/.config/fish_bluewy/config.fish" >$HOME/.config/fish/conf.d/init_bluewy.fish
