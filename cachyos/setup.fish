#!/usr/bin/env fish

set current_dir (realpath (dirname (status filename)))

$current_dir/files/setup.fish
$current_dir/tweaks/change_keyboard.fish
$current_dir/tweaks/install_packages/install_packages.fish
