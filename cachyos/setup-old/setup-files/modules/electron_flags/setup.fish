#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source_dir $script_dir/files
set target_dir $HOME/.config

function install
    for source in $source_dir/*
        set source_filename (basename $source)

        prepare $target_dir/$source_filename
        ln -s $source $target_dir/$source_filename
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
