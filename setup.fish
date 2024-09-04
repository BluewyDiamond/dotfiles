#!/usr/bin/env fish

./copy_files.fish
./post/change_keyboard.fish
# ./post/install_packages_v2.fish # need to fix path
echo "script => temporary fix: run package install script manually"
./post/change_vconsole_font.fish
./link_files.fish
