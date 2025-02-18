#!/usr/bin/env fish

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

set current_dir (realpath (dirname (status filename)))

for file in $current_dir/modules/*
    prompt "Process $(basename $file)? [y/N]"
    set choice (input N)

    if not string match -q -i -- Y "$choice"
        continue
    end

    $current_dir/manage_module.fish $file
end
