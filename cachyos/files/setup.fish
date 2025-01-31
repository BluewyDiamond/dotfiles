#!/usr/bin/env fish

set current_dir (realpath (dirname (status filename)))

for file in $PWD/modules/*
    $current_dir/manage_module.fish $file
end
