#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../../lib.fish

set source_dir $script_dir/files
set target_dir $HOME/.local/bin

for file in $source_dir/*
    process false link $file $target_dir/(basename $file)
end
