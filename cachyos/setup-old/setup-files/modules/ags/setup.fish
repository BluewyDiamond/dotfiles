#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source $script_dir/files
set target $HOME/.config/ags

function install
    prepare $target
    ln -s $source $target
end

function uninstall
    unlink $target
end

switch $argv[1]
    case install
        install
    case uninstall
        uninstall
end
