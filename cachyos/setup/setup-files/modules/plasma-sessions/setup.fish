#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source_01 $script_dir/files/start_plasma_with_card_0.fish
set source_02 $script_dir/files/plasma_with_card_0.desktop
set source_03 $script_dir/files/start_plasma_with_card_1.fish
set source_04 $script_dir/files/plasma_with_card_1.desktop
set target_01 /usr/local/bin/(basename $source_01)
set target_02 /usr/share/wayland-sessions/(basename $source_02)
set target_03 /usr/local/bin/(basename $source_03)
set target_04 /usr/share/wayland-sessions/(basename $source_04)

function install
    sudo_prepare $target_01
    sudo cp $source_01 $target_01

    sudo_prepare $target_02
    sudo cp $source_02 $target_02

    sudo_prepare $target_03
    sudo cp $source_03 $target_03

    sudo_prepare $target_04
    sudo cp $source_04 $target_04
end

function uninstall
    sudo rm $target_01
    sudo rm $target_02
    sudo rm $target_03
    sudo rm $target_04
end

switch $argv[1]
    case install
        install
    case uninstall
        uninstall
end
