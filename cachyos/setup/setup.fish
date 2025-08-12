#!/usr/bin/env fish

set script_path (realpath (dirname (status filename)))

# [Requirements]
#
set required_packages yq paru trash-cli fd
set required_packages_to_install

for required_package in $required_packages
    if not pacman -Q $required_package 2&>/dev/null
        set -a required_packages_to_install $required_package
    end
end

if set -q required_packages_to_install[1]
    sudo pacman -S $required_packages_to_install
end

# [Extract Variables]
#
set configs_pathnames $argv[2..-1]
set std_packages
set aur_packages
set local_path_packages
set services
set ignored_packages
set configs_to_source_pathnames
set configs_to_source_2_pathnames # im too dumb to recurse properly :3

# ignore this packages
set -a std_packages $required_packages

for config_pathname in $configs_pathnames
    set -a configs_to_source_pathnames (tomlq -r '(.configs_to_source // [])[]' $config_pathname)
    set -a std_packages (tomlq -r '[.packages // {} | .. | objects | .std // []] | add | .[]' $config_pathname)
    set -a aur_packages (tomlq -r '[.packages // {} | .. | objects | .aur // []] | add | .[]' $config_pathname)
    set -a local_path_packages (tomlq -r '[.packages // {} | .. | objects | .local_paths // []] | add | .[]' $config_pathname)
    set -a services (tomlq -r ".services.enable // [] | .[]" $config_pathname)
    set -a ignored_packages (tomlq -r '[.ignore // {} | .. | objects | .packages // []] | add | .[]' $config_pathname)
end

for config_to_source_pathname in $configs_to_source_pathnames
    set -a configs_to_source_2_pathnames (tomlq -r '(.configs_to_source // [])[]' $config_to_source_pathname)
    set -a std_packages (tomlq -r '[.packages // {} | .. | objects | .std // []] | add | .[]' $config_to_source_pathname)
    set -a aur_packages (tomlq -r '[.packages // {} | .. | objects | .aur // []] | add | .[]' $config_to_source_pathname)
    set -a local_path_packages (tomlq -r '[.packages // {} | .. | objects | .local_paths // []] | add | .[]' $config_to_source_pathname)
    set -a services (tomlq -r ".services.enable // [] | .[]" $config_pathname)
    set -a ignored_packages (tomlq -r '[.ignore // {} | .. | objects | .packages // []] | add | .[]' $config_to_source_pathname)
end

for config_to_source_2_pathname in $configs_to_source_2_pathnames
    set -a std_packages (tomlq -r '[.packages // {} | .. | objects | .std // []] | add | .[]' $config_to_source_2_pathname)
    set -a aur_packages (tomlq -r '[.packages // {} | .. | objects | .aur // []] | add | .[]' $config_to_source_2_pathname)
    set -a local_path_packages (tomlq -r '[.packages // {} | .. | objects | .local_paths // []] | add | .[]' $config_to_source_2_pathname)
    set -a services (tomlq -r ".services.enable // [] | .[]" $config_to_source_2_pathname)
    set -a ignored_packages (tomlq -r '[.ignore // {} | .. | objects | .packages // []] | add | .[]' $config_to_source_2_pathname)
end

# in the case that only the basename is needed
set local_packages

for local_path_package in $local_path_packages
    set -a local_packages (basename $local_path_package)
end

# [Helper Functions]
#
function is_package_a_dependency
    argparse 'package=' -- $argv or return
    set package $_flag_package
    set pactree_output (pactree -r $package)

    if test $status -eq 1
        return 1
    end

    set pactree_output_line_count (count $pactree_output)

    if test $pactree_output_line_count -ge 2
        return 0
    else
        return 1
    end
end

function get_unlisted_packages
    argparse 'wanted-packages=' -- $argv
    set wanted_packages (string split ' ' $_flag_wanted_packages)
    set installed_packages (pacman -Qqe)
    set unlisted_packages

    for installed_package in $installed_packages
        if contains $installed_package $wanted_packages
            continue
        end

        if is_package_a_dependency --package $installed_package
            continue
        end

        set -a unlisted_packages $installed_package
    end

    string join \n $unlisted_packages
end

function trace
    argparse 'level=' 'context=' 'reason=' -- $argv or return
    set level $_flag_level
    set context $_flag_context
    set reason $_flag_reason

    set trace_line

    if test error = $level
        set -a trace_line (set_color red)ERROR(set_color normal)
    else if test warn = $level
        set -a trace_line (set_color yellow)WARN(set_color normal)
    else if test info = $level
        set -a trace_line (set_color blue)INFO(set_color normal)
    end

    if not test -z "$context"
        set -a trace_line (set_color magenta)"@$context"(set_color normal)
    end

    if not test -z "$reason"
        set -a trace_line $reason
    end

    echo $trace_line
end

function run_as
    argparse 'owner=' 'cmd=' -- $argv or return
    set owner $_flag_owner
    set cmd (string split ' ' $_flag_cmd)

    if test (whoami) = "$owner"
        eval $cmd
    else
        eval sudo -iu $owner -- $cmd
    end
end

# [Util Functions]
#
function prepare_target
    argparse 'owner=' 'target-pathname=' -- $argv or return
    set owner $_flag_owner
    set target_pathname $_flag_target_pathname
    set target_path (dirname $target_pathname)

    if test -f $target_pathname; or test -L $target_pathname; or test -d $target_pathname
        trace --level warn --context (status function) --reason "file conflict found: '$target_pathname'"
        run_as --owner $owner --cmd "trash $target_pathname"
    end

    if not test -d $target_path
        run_as --owner $owner --cmd "mkdir -p $target_path"
    end
end

function install_file
    argparse 'owner=' 'source-pathname=' 'operation=' 'target-pathname=' -- $argv or return
    set owner $_flag_owner
    set source_pathname $_flag_source_pathname
    set operation $_flag_operation
    set target_pathname $_flag_target_pathname

    trace --level info --context (status function) --reason "tracking, owner:'$owner' source_pathname:'$source_pathname' operation: '$operation' target_pathname: '$target_pathname'"

    if not test -e $source_pathname
        trace --level error --context (status function) --reason "file does not exist, source_pathname: '$source_pathname'"
        return 1
    end

    set is_target_matched false

    if test copy = "$operation"
        if test -f $target_pathname; and test (cat $source_pathname | string collect) = (cat $target_pathname | string collect)
            set is_target_matched true
        end
    else if test link = "$operation"
        if test -L $target_pathname
            set existing_link_points_to (readlink -f $target_pathname)

            if test "$source_pathname" = "$existing_link_points_to"
                set is_target_matched true
            end
        end
    else
        trace --level error --context (status function) --reason "invalid value, operation: '$operation'"
        return 1
    end

    if test true = "$is_target_matched"
        trace --level info --context (status function) --reason "content match, target_pathname: '$target_pathname'"
        return 0
    end

    set operation_cmd

    if test copy = "$operation"
        set operation_cmd cp
    else if test link = "$operation"
        set operation_cmd ln -s
    else
        trace --level error --context (status function) --reason "invalid value, operation: '$operation'"
        return 1
    end

    prepare_target --owner $owner --target-pathname $target_pathname
    run_as --owner $owner --cmd "$operation_cmd $source_pathname $target_pathname"
end

function spawn_file
    argparse 'owner=' 'content=' 'target-pathname=' -- $argv or return
    set owner $_flag_owner
    set target_content $_flag_content
    set target_pathname $_flag_target_pathname
    set run_as

    if not test (whoami) = "$owner"
        set run_as sudo -iu $owner --
    end

    trace --level info --context (status function) --reason "tracking, target_pathname: '$target_pathname'"

    if test -f $target_pathname
        set existing_target_content (cat $target_pathname | string collect)

        if test "$target_content" = "$existing_target_content"
            trace --level info --context (status function) --reason "content match, target: '$target_pathname'"
            return 0
        end
    end

    prepare_target --owner $owner --target-pathname $target_pathname
    run_as --owner $owner --cmd "echo $target_content | tee $target_pathname >/dev/null"
end

function check_file
    argparse 'operation=' 'source-pathname=' 'content=' 'target-pathname=' -- $argv or return
    set operation $_flag_operation
    set content $_flag_content
    set source_pathname $_flag_source_pathname
    set target_pathname $_flag_target_pathname
    set is_target_matched false

    if test copy = "$operation"; or test -z "$operation"
        set source_content

        if test -z "$content"
            set source_content (cat $source_pathname | string collect)
        else
            set source_content $content
        end

        if test -f $target_pathname; and test "$source_content" = (cat $target_pathname | string collect)
            set is_target_matched true
        end
    else if test link = "$operation"
        if test -L $target_pathname
            set existing_link_points_to (readlink -f $target_pathname)

            if test "$source_pathname" = "$existing_link_points_to"
                set is_target_matched true
            end
        end
    else
        trace --level error --context (status function) --reason "invalid value, operation: '$operation'"
        return 1
    end

    if test true = $is_target_matched
        trace --level info --context (status function) --reason "content match, target_pathname: '$target_pathname'"
        return 0
    else
        trace --level error --context (status function) --reason "content does not match, target_pathname: '$target_pathname'"
        return 1
    end
end

function get_missing_packages
    argparse "wanted-packages=" -- $argv or return
    set wanted_packages (string split ' ' $_flag_wanted_packages)
    set missing_packages

    for package in $wanted_packages
        if not pacman -Q $package 2&>/dev/null
            set -a missing_packages $package
        end

        continue
    end

    echo -n $missing_packages
end

# [Main]
#
function install_std_packages
    trace --level info --context (status function)
    set missing_std_packages

    for std_package in $std_packages
        if pacman -Q $std_package 2&>/dev/null
            continue
        end

        set -a missing_std_packages $std_package
    end

    if set -q missing_std_packages[1]
        sudo pacman -S $missing_std_packages
    else
        trace --level info --context (status function) --reason "skipped, std packages are already installed"
    end
end

function install_aur_packages
    trace --level info --context (status function)
    set missing_aur_packages

    for aur_package in $aur_packages
        if pacman -Q $aur_package 2&>/dev/null
            continue
        end

        set -a missing_aur_packages $aur_package
    end

    if set -q missing_aur_packages[1]
        paru -S --aur $missing_aur_packages
    else
        trace --level info --context (status function) --reason "skipped, aur packages are already installed"
    end
end

function install_local_packages
    trace --level info --context (status function)
    set missing_local_path_packages

    for local_path_package in $local_path_packages
        if pacman -Q (basename $local_path_package) 2&>/dev/null
            continue
        end

        set -a missing_local_path_packages $local_path_package
    end

    if set -q missing_local_path_packages[1]
        for missing_local_path_package in $missing_local_path_packages
            pushd $script_path/$missing_local_path_package
            makepkg -si
            popd
        end
    else
        trace --level info --context (status function) --reason "skipped, local packages are already installed"
    end
end

if test install = $argv[1]
    install_std_packages
    install_aur_packages
    install_local_packages

    for config_pathname in $configs_pathnames $configs_to_source_pathnames $configs_to_source_2_pathnames
        set install_files_length (tomlq -r '.install_files // [] | length' $config_pathname)
        set spawn_files_length (tomlq -r '.spawn_files // [] | length' $config_pathname)

        for install_file_index in (seq 0 (math $install_files_length - 1))
            set owner (tomlq -r ".install_files[$install_file_index].owner" $config_pathname)
            set operation (tomlq -r ".install_files[$install_file_index].operation" $config_pathname)
            set source_pathname $script_path/(tomlq -r ".install_files[$install_file_index].source // \"\"" $config_pathname)
            set target_name (tomlq -r ".install_files[$install_file_index].target_name // \"\"" $config_pathname)
            set target_path (tomlq -r ".install_files[$install_file_index].target_path // \"\"" $config_pathname)
            set target_path_regex (tomlq -r ".install_files[$install_file_index].target_path_regex // \"\"" $config_pathname)

            set target_pathnames

            if not test -z (string trim -- $target_path_regex)
                set found_target_paths (fd --regex $target_path_regex $target_path)
                set found_target_pathnames

                for found_target_path in $found_target_paths
                    if not test -z (string trim -- $target_name)
                        set -a found_target_pathnames $found_target_path/$target_name
                    end

                    set -a found_target_pathnames $found_target_path/(basename $source_pathname)
                end

                trace --level error --context (status function) --reason "not yet implemented"
                continue
            else if not test -z (string trim -- $target_path)
                if not test -z (string trim -- $target_name)
                    set -a target_pathnames $target_path/$target_name
                else
                    set -a target_pathnames $target_path/(basename $source_pathname)
                end
            end

            for target_pathname in $target_pathnames
                install_file --owner $owner --source-pathname $source_pathname --operation $operation --target-pathname $target_pathname
            end
        end

        for spawn_file_index in (seq 0 (math $spawn_files_length - 1))
            set owner (tomlq -r ".spawn_files[$spawn_file_index].owner" $config_pathname)
            set target_pathname (tomlq -r ".spawn_files[$spawn_file_index].target" $config_pathname)
            set target_content (tomlq -r ".spawn_files[$spawn_file_index].content" $config_pathname | string collect)

            spawn_file --owner $owner --target-pathname $target_pathname --content $target_content
        end
    end

    set enabled_services (fd -e service . /etc/systemd/system/*.wants -x basename | string replace -r '\.service$' '')
    set services_to_enable

    for service in $services
        if contains $service $enabled_services
            trace --level info --context enable_service --reason "is already enabled, service: '$service'"
            continue
        end

        set -a services_to_enable $service
    end

    for service_to_enable in $services_to_enable
        trace --level info --context enable_service --reason "tracking, service: '$service_to_enable'"
        sudo systemctl enable $service_to_enable
    end
else if test cleanup = "$argv[1]"
    trace --level info --context cleanup_packages

    set unlisted_packages (get_unlisted_packages --wanted-packages "$std_packages $aur_packages $local_packages $ignored_packages")

    if set -q unlisted_packages[1]
        sudo pacman -Rns $unlisted_packages
    end

    trace --level info --context cleanup_services

    set enabled_services (fd -e service . /etc/systemd/system/*.wants -x basename | string replace -r '\.service$' '')
    set services_to_disable

    for enabled_service in $enabled_services
        if contains $enabled_service $services
            continue
        end

        set -a services_to_disable $enabled_service
    end

    for service_to_disable in $services_to_disable
        trace --level info --context disable_service --reason "tracking, service: '$service_to_disable'"
        sudo systemctl disable $service_to_disable
    end
else if test check = $argv[1]
    trace --level info --context check_packages
    set missing_packages (get_missing_packages --wanted-packages "$std_packages $aur_packages $local_packages $ignored_packages")

    if set -q missing_packages[1]
        echo "packages_not_found: '$packages_not_found'"
    end

    set unlisted_packages (get_unlisted_packages --wanted-packages "$std_packages $aur_packages $local_packages $ignored_packages")

    if set -q unlisted_packages[1]
        echo "unlisted_packages: '$unlisted_packages'"
    end

    for config_pathname in $configs_pathnames $configs_to_source_pathnames $configs_to_source_2_pathnames
        set install_files_length (tomlq -r '.install_files // [] | length' $config_pathname)
        set spawn_files_length (tomlq -r '.spawn_files // [] | length' $config_pathname)

        for install_file_index in (seq 0 (math $install_files_length - 1))
            set owner (tomlq -r ".install_files[$install_file_index].owner" $config_pathname)
            set operation (tomlq -r ".install_files[$install_file_index].operation" $config_pathname)
            set source_pathname $script_path/(tomlq -r ".install_files[$install_file_index].source // \"\"" $config_pathname)
            set target_name (tomlq -r ".install_files[$install_file_index].target_name // \"\"" $config_pathname)
            set target_path (tomlq -r ".install_files[$install_file_index].target_path // \"\"" $config_pathname)
            set target_path_regex (tomlq -r ".install_files[$install_file_index].target_path_regex // \"\"" $config_pathname)

            set target_pathnames

            if not test -z (string trim -- $target_path_regex)
                set found_target_paths (fd --regex $target_path_regex $target_path)
                set found_target_pathnames

                for found_target_path in $found_target_paths
                    if not test -z (string trim -- $target_name)
                        set -a found_target_pathnames $found_target_path/$target_name
                    end

                    set -a found_target_pathnames $found_target_path/(basename $source_pathname)
                end

                trace --level error --context (status function) --reason "not yet implemented"
                continue
            else if not test -z (string trim -- $target_path)
                if not test -z (string trim -- $target_name)
                    set -a target_pathnames $target_path/$target_name
                else
                    set -a target_pathnames $target_path/(basename $source_pathname)
                end
            end

            for target_pathname in $target_pathnames
                check_file --source-pathname $source_pathname --operation $operation --target-pathname $target_pathname
            end
        end

        for spawn_file_index in (seq 0 (math $spawn_files_length - 1))
            set owner (tomlq -r ".spawn_files[$spawn_file_index].owner" $config_pathname)
            set target_pathname (tomlq -r ".spawn_files[$spawn_file_index].target" $config_pathname)
            set target_content (tomlq -r ".spawn_files[$spawn_file_index].content" $config_pathname | string collect)

            check_file --content $target_content --target-pathname $target_pathname
        end
    end
else if test help = $argv[1]
    echo "USAGE: COMMAND HOST_PATHNAME_1 HOST_PATHNAME_2 ... HOST_PATHNAME_9"
    echo COMMANDS
    echo "- > install"
    echo "In the following order it installs: packages, files and services."
    echo "- > cleanup"
    echo "Removes unlisted packages."
    echo "- > uninstall"
    echo "Removes files."
    echo "- > check"
    echo "Verifies the configuration is setup."
end
