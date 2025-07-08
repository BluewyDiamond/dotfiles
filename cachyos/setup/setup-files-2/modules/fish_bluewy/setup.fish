#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source $script_dir/files
set target $HOME/.config/fish_bluewy

function install
    prepare $target
    ln -s $source $target
    echo "source $target/config.fish" >$HOME/.config/fish/conf.d/init_bluewy.fish
end

function uninstall
    unlink $target
    rm $HOME/.config/fish/conf.d/init_bluewy.fish
end

switch $argv[1]
    case install
        install
    case uninstall
        uninstall
end
