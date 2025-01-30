#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))

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

if not which jq &>/dev/null
    sudo pacman -S jq
end

if not which trash &>/dev/null
    sudo pacman -S trash-cli
end

set module $argv
set hook_file $module/options.json

set the_files

for file in (command ls $module/index)
    set -a the_files "$module/index/$file"
end

set pre_hook $module/prehook
set post_hook $module/posthook

if not test -d $module
    prompt "Module does not exist..."
    exit 1
end

if not test -f $hook_file
    prompt "Missing hook file..."
    exit 1
end

set operation (jq -r '.operation' $hook_file)
set on_conflict (jq -r '.on_conflict' $hook_file)
set target_dir (jq -r '.target_dir' $hook_file)
set target_dir (eval echo "$target_dir")

switch $operation
    case copy
    case link

    case '*'
        prompt "Invalid operation field..."
        exit 1
end

switch $on_conflict
    case trash
    case remove

    case '*'
        prompt "Invalid on_conflict field..."
        exit 1
end

if not test -d $target_dir
    prompt "Invalid target directory..."
    exit 1
end

if test -f $pre_hook
    $pre_hook
end

switch $on_conflict
    case trash
        for submodule in $the_files
            set -l name (basename $submodule)

            if test -e "$target_dir/$name" -o -L "$target_dir/$name"
                trash "$target_dir/$name"
            end
        end
    case remove
        for submodule in $the_files
            set -l name (basename $submodule)

            if test -e "$target_dir/$name" -o -L "$target_dir/$name"
                rm -r "$target_dir/$name"
            end
        end

    case '*'
        echo oopsie
        exit 1
end

switch $operation
    case copy
        for submodule in $the_files
            cp -r $submodule $target_dir
        end
    case link
        for submodule in $the_files
            ln -s $submodule $target_dir
        end
end

if test -f $post_hook
    $post_hook
end
