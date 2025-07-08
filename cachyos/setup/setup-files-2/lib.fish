#!/usr/bin/env fish

function backup_recursive --argument target
    set backup $target.bak

    while test -e $backup
        set backup $backup.bak
    end

    if test -w (dirname $target)
        mv $target $backup
    else
        sudo mv $target $backup
    end
end

function process
    set super $argv[1]

    if not contains "$super" true false
        echo (set_color red)"ERROR: "(set_color normal)"Unexpected value... |super=$super|"
        return 1
    end

    set operation $argv[2]

    if not contains "$operation" copy link
        echo (set_color red)"ERROR: "(set_color normal)"Unexpected value... |operation=$operation|"
        return 1
    end

    set source $argv[3]

    if not test -e "$source"
        echo (set_color red)"ERROR: "(set_color normal)"Invalid file... |source=$source|"
        return 1
    end

    set target $argv[4]

    # TODO: Rather than checking if target_dir exists and then immediatly
    # do stuff, store in a variable the state and then based of it do it.
    # Maybe this way it is more readable.

    echo "TASK: $operation $source to $target, super is $super."

    if test true = $super
        set sudo_command sudo
    end

    set target_dirname (dirname $target)

    if not test -d $target_dirname
        if not test -e $target_dirname
            set -l for_lsp echo "INFO: target_dirname=$target_dirname does not exist, it will be created."
            set -a prepare_commands_as_strings "$for_lsp"
            set -a prepare_commands_as_strings "$sudo_command mkdir -p $target_dirname"
        else
            set -l for_lsp echo "INFO: target_dirname=$target_dirname is not a folder, it will be trashed and recreated."
            set -a prepare_commands_as_strings "$for_lsp"
            set -a prepare_commands_as_strings "$sudo_command trash $target_dirname"
            set -a prepare_commands_as_strings "$sudo_command mkdir -p $target_dirname"
        end
    end

    if test -e "$target" -o -L "$target"
        set -l for_lsp echo "WARNING: target=$target already exists, it will be trashed."
        set -a prepare_commands_as_strings "$for_lsp"
        set -a prepare_commands_as_strings "$sudo_command trash $target"
    end

    if test copy = $operation
        set -a action_command cp
    else
        set -a action_command ln -s
    end

    set execute_command $sudo_command $action_command $source $target

    # calculated commands to run
    #
    for command_as_string in $prepare_commands_as_strings
        set cmd (string split ' ' (string trim $command_as_string))
        $cmd
    end

    $execute_command
end

function prepare
    set target $argv[1]

    set target_dir (dirname $target)

    # If target_dir exists but is not a directory, trash it
    if test -f $target_dir; or test -L $target_dir
        echo "WARNING: $target_dir is not a directory. Trashing it."
        trash $target_dir
    end

    # Create target_dir if it doesn't exist
    if not test -d $target_dir
        echo "Creating directory: $target_dir"
        mkdir -p $target_dir
    end

    # If target exists (file, link, etc.), trash it
    if test -e $target; or test -L $target
        echo "Trashing existing target: $target"
        trash $target
    end
end

function sudo_prepare
    set target $argv[1]

    set target_dir (dirname $target)

    # If target_dir exists but is not a directory, trash it
    if test -f $target_dir; or test -L $target_dir
        echo "WARNING: $target_dir is not a directory. Trashing it."
        sudo trash $target_dir
    end

    # Create target_dir if it doesn't exist
    if not test -d $target_dir
        echo "Creating directory: $target_dir"
        sudo mkdir -p $target_dir
    end

    # If target exists (file, link, etc.), trash it
    if test -e $target; or test -L $target
        echo "Trashing existing target: $target"
        sudo trash $target
    end
end
