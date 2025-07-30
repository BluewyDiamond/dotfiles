#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source_01 $script_dir/files/librewolf.overrides.cfg
set source_02 $script_dir/files/userChrome.css
set target_dir $HOME/.librewolf

function install
    set source_01_filename (basename $source_01)
    set source_02_filename (basename $source_02)

    prepare $target_dir/$source_01_filename
    ln -s $source_01 $target_dir/$source_01_filename

    for profile_dir in (find "$target_dir" -type d -name '*default-default' 2>/dev/null)
        set chrome_dir $profile_dir/chrome

        prepare $chrome_dir/$source_02_filename
        ln -s $source_02 $chrome_dir/$source_02_filename
    end
end

function uninstall
    echo "function uninstall is unimplemented!"
end

switch $argv[1]
    case install
        install
    case uninstall
        uninstall
end
