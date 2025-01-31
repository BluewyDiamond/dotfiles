#!/usr/bin/env fish

set SCRIPT_NAME (path basename (status filename))

function log_message
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function read_input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

if not command -q jq
    log_message "Installing jq..."
    sudo pacman -S jq || exit 1
end

if not command -q trash
    log_message "Installing trash-cli..."
    sudo pacman -S trash-cli || exit 1
end

set module $argv[1]
set options_file $module/options.json

if not test -d $module
    log_message "Module does not exist..."
    exit 1
end

if not test -f $options_file
    log_message "Missing options file..."
    exit 1
end

set operation (jq -r '.operation' $options_file)
set on_conflict (jq -r '.on_conflict' $options_file)
set target_dir (jq -r '.target_dir' $options_file)
set target_dir (eval echo "$target_dir")
set only_hooks (jq -r '.only_hooks' $options_file)
set sudo (jq -r '.sudo' $options_file)

set pre_hook_exe $module/prehook
set post_hook_exe $module/posthook

if test $only_hooks = true
    if test -f $pre_hook_exe -a -x $pre_hook_exe
        $pre_hook_exe
    end

    if test -f $post_hook_exe -a -x $post_hook_exe
        $post_hook_exe
    end

    exit 0
end

switch $operation
    case copy link

    case '*'
        log_message "Invalid operation field..."
        exit 1
end

switch $on_conflict
    case trash remove

    case '*'
        log_message "Invalid on_conflict field..."
        exit 1
end

if not test -d $target_dir
    log_message "Invalid target directory..."
    exit 1
end

if test -f $pre_hook_exe -a -x $pre_hook_exe
    $pre_hook_exe
end

set folders

for file in (command ls $module/index)
    set -a folders "$module/index/$file"
end

switch $on_conflict
    case trash
        for folder in $folders
            set name (path basename $folder)

            if test -e "$target_dir/$name" -o -L "$target_dir/$name"
                if test "$sudo" = true
                    sudo trash "$target_dir/$name"
                else
                    trash "$target_dir/$name"
                end
            end
        end
    case remove
        for folder in $folders
            set name (path basename $folder)

            if test -e "$target_dir/$name" -o -L "$target_dir/$name"
                if test "$sudo" = true
                    sudo rm -r "$target_dir/$name"
                else
                    rm -r "$target_dir/$name"
                end
            end
        end
    case skip
        set quit false

        for folder in $folders
            set name (path basename $folder)

            if test -e "$target_dir/$name" -o -L "$target_dir/$name"
                set quit true
            end
        end

        if test quit = true
            log_message "Skipping because on_conflict is set to skip."
            exit 1
        end
end

switch $operation
    case copy
        for folder in $folders
            if test "$sudo" = true
                sudo cp -r $folder $target_dir
            else
                cp -r $folder $target_dir
            end
        end
    case link
        for folder in $folders
            if test "$sudo" = true
                sudo ln -s $folder $target_dir
            else
                ln -s $folder $target_dir
            end
        end
end

if test -f $post_hook_exe -a -x $post_hook_exe
    $post_hook_exe
end
