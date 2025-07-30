#!/usr/bin/env fish

set this_script_pathname (realpath (status filename))

if not type -q trash
    echo "ERROR: 'trash-cli' is not installed but is required by $this_script_pathname"
    exit 1
end

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
