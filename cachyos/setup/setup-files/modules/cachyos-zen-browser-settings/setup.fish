#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source_01 $script_dir/files/cachyos.js
set source_02 $script_dir/files/policies.json
set target_01 /opt/zen-browser-bin/defaults/pref/(basename $source_01)
set target_02 /opt/zen-browser-bin/distribution/(basename $source_02)

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
