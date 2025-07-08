#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

set source_dir $script_dir/files
set target_dir /etc/libinput

for file in $source_dir/*
    set target_file $target_dir/(basename $file)

    if not test -e $target_file
        continue
    end

    rm $target_file
end
