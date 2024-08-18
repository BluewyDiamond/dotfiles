#!/usr/bin/env fish

# prepare fish config directory
rm -r $HOME/.config/fish
mkdir $HOME/.config/fish
mkdir $HOME/.config/fish/conf.d
mkdir $HOME/.config/fish/functions
mkdir $HOME/.config/fish/themes

for module in $PWD/stow/modules/*
    stow $module -t $HOME
end
