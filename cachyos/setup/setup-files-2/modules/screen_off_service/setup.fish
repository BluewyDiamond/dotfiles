#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))
source $script_dir/../../lib.fish

set source_01 $script_dir/files/screen_off.fish
set source_02 $script_dir/files/screen_off.service
set target_01 /usr/local/bin/(basename $source_01)
set target_02 /etc/systemd/system/(basename $source_02)

function install
    sudo_prepare $target_01
    sudo cp $source_01 $target_01

    sudo_prepare $target_02
    sudo cp $source_02 $target_02
end

function uninstall
    sudo rm $target_01
    sudo rm $target_02
end

switch $argv[1]
    case install
        install
    case uninstall
        uninstall
end
