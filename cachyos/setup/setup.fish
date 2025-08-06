#!/usr/bin/env fish

set script_path (realpath (dirname (status filename)))

# some requirements

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

# declaration of variables for data to be obtained

set hosts_pathnames $argv[2..-1]
set common_packages_pathnames
set std_packages
set aur_packages
set local_path_packages
set services

# ignore this packages
set -a std_packages $required_packages

# partial acquisition of data (acquisition of global data)

for host_pathname in $hosts_pathnames
    set -a common_packages_pathnames (tomlq -r '(.common_packages // [])[]' $host_pathname)
    set -a std_packages (tomlq -r '[.packages // {} | .. | objects | .std // []] | add | .[]' $host_pathname)
    set -a aur_packages (tomlq -r '[.packages // {} | .. | objects | .aur // []] | add | .[]' $host_pathname)
    set -a local_path_packages (tomlq -r '[.packages // {} | .. | objects | .local_paths // []] | add | .[]' $host_pathname)
    set -a services (tomlq -r ".services.enable // [] | .[]" $host_pathname)
end

for common_package_filepath in $common_packages_pathnames
    set -a std_packages (tomlq -r '.std // [] | .[]' $script_path/$common_package_filepath)
    set -a aur_packages (tomlq -r '.aur // [] | .[]' $script_path/$common_package_filepath)
    set -a local_path_packages (tomlq -r '.local_paths // [] | .[]' $script_path/$common_package_filepath)
end

# action based on the data

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

    echo -n $unlisted_packages
end

function prepare_target
    argparse 'owner=' 'target=' -- $argv or return
    set owner $_flag_owner
    set target_pathname $_flag_target
    set target_path (dirname $target_pathname)

    if test -f $target_pathname; or test -L $target_pathname; or test -d $target_pathname
        echo "[WARN] TRASH TARGET | CONFLICT FOUND | TARGET={$target_pathname}"
        sudo -iu $owner -- trash $target_pathname
    end

    if not test -d $target_path
        sudo -iu $owner -- mkdir -p $target_path
    end
end

function install_files
    argparse 'owner=' 'sources=' 'operation=' 'targets=' -- $argv or return
    set owner $_flag_owner
    set source_pathnames (string split ' ' "$_flag_sources")
    set operation $_flag_operation
    set target_pathnames (string split ' ' "$_flag_targets")

    for source_pathname in $source_pathnames
        if not test -e $source_pathname
            echo "[ERROR] SKIP | INVALID VALUE | SOURCE={$source_pathname}"
            continue
        end

        echo "[INFO] INSTALL FILE | OWNER={$owner} OPERATION={$operation} SOURCE={$source_pathname}"

        for target_pathname in $target_pathnames
            echo "[INFO] TARGET={$target_pathname}"

            switch "$operation"
                case copy
                    if test -f $target_pathname
                        if test (cat $source_pathname | string collect) = (cat $target_pathname | string collect)
                            echo "[INFO] SKIP | MATCHING FILE FOUND"
                            continue
                        end
                    end

                    prepare_target --owner $owner --target $target_pathname
                    sudo -iu $owner -- cp $source_pathname $target_pathname
                case link
                    if test -L $target_pathname
                        set existing_link_points_to (readlink -f $target_pathname)

                        if test "$source_pathname" = "$existing_link_points_to"
                            echo "[INFO] SKIP | MATCHING LINK FOUND"
                            continue
                        end

                    end

                    prepare_target --owner $owner --target $target_pathname
                    sudo -iu $owner -- ln -s $source_pathname $target_pathname
                case '*'
                    echo "[INFO] SKIP | UNIMPLEMENTED OPERATION | OPERATION={$operation}"
            end
        end
    end
end

function spawn_file
    argparse 'owner=' 'content=' 'target=' -- $argv or return
    set owner $_flag_owner
    set target_content $_flag_content
    set target_pathname $_flag_target

    if test -f $target_pathname
        set existing_target_content (cat $target_pathname | string collect)

        if test "$target_content" = "$existing_target_content"
            echo "[INFO] SKIP | MATCHING FILE FOUND"
            return
        end
    end

    prepare_target --owner $owner --target $target_pathname
    echo $target_content | sudo -iu $owner -- tee $target_pathname >/dev/null
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

switch $argv[1]
    case install
        echo "[INFO] INSTALL STD PACKAGES"
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
            echo "[INFO] SKIP | ALREADY INSTALLED"
        end

        echo "[INFO] INSTALL AUR PACKAGES"
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
            echo "[INFO] SKIP | ALREADY INSTALLED"
        end

        echo "[INFO] INSTALL LOCAL PACKAGES"
        set missing_local_path_packages

        for local_path_package in $local_path_packages
            if pacman -Q (basename $local_path_package) 2&>/dev/null
                continue
            end

            set -a missing_local_path_packages $local_path_package
        end

        if set -q missing_local_path_packages[1]
            for missing_local_path_package in $missing_local_path_packages
                makepkg -si $script_path/$missing_local_path_package
            end
        else
            echo "[INFO] SKIP | ALREADY INSTALLED"
        end

        for host_pathname in $hosts_pathnames
            set install_files_length (tomlq -r '.install_files // [] | length' $host_pathname)
            set spawn_files_length (tomlq -r '.spawn_files // [] | length' $host_pathname)

            for install_file_index in (seq 0 (math $install_files_length - 1))
                set owner (tomlq -r ".install_files[$install_file_index].owner" $host_pathname)
                set operation (tomlq -r ".install_files[$install_file_index].operation" $host_pathname)
                set source_pathname $script_path/(tomlq -r ".install_files[$install_file_index].source // \"\"" $host_pathname)
                set target_name (tomlq -r ".install_files[$install_file_index].target_name // \"\"" $host_pathname)
                set target_path (tomlq -r ".install_files[$install_file_index].target_path // \"\"" $host_pathname)
                set target_path_regex (tomlq -r ".install_files[$install_file_index].target_path_regex // \"\"" $host_pathname)

                if not test -e $source_pathname
                    echo "[ERROR] INVALID VALUE | SOURCE={$source_pathname}"
                    continue
                end

                if not test -z (string trim -- $target_path_regex)
                    set found_target_paths (fd --regex $target_path_regex $target_path)
                    set found_target_pathnames

                    for found_target_path in $found_target_paths
                        if not test -z (string trim -- $target_name)
                            set -a found_target_pathnames $found_target_path/$target_name
                        end

                        set -a found_target_pathnames $found_target_path/(basename $source_pathname)
                    end

                    # echo "[DEBUG] found_target_proccessed_array={$found_target_proccessed_array}"

                    echo "[WARN] NOT IMPLEMENTED"
                    continue

                    # install_files --owner $owner --sources "$source_pathname" --operation $operation --targets "$found_target_proccessed_array"
                else if not test -z (string trim -- $target_path)
                    set target_pathname

                    if not test -z (string trim -- $target_name)
                        set target_pathname $target_path/$target_name
                    else
                        set target_pathname $target_path/(basename $source_pathname)
                    end

                    install_files --owner $owner --sources $source_pathname --operation $operation --targets $target_pathname
                else
                    echo "[ERROR] INVALID VALUE | TARGET_REGEX={$target_path_regex} | TARGET={$target}"
                    continue
                end
            end

            for spawn_file_index in (seq 0 (math $spawn_files_length - 1))
                set owner (tomlq -r ".spawn_files[$spawn_file_index].owner" $host_pathname)
                set target_pathname (tomlq -r ".spawn_files[$spawn_file_index].target" $host_pathname)
                set target_content (tomlq -r ".spawn_files[$spawn_file_index].content" $host_pathname | string collect)
                echo "[INFO] SPAWN FILE | TARGET={$target_pathname}"

                spawn_file --owner $owner --target $target_pathname --content $target_content
            end
        end

        set enabled_services (fd -e service . /etc/systemd/system/*.wants -x basename | string replace -r '\.service$' '')
        set services_to_enable

        for service in $services
            if contains $service $enabled_services
                echo "[INFO] SKIP | ALREADY ENABLED | SERVICE={$service}"
                continue
            end

            set -a services_to_enable $service
        end

        for service_to_enable in $services_to_enable
            echo "[INFO] ENABLE SERVICE | SERVICE={$service_to_enable}"
            sudo systemctl enable $service_to_enable
        end
    case cleanup
        echo "[INFO] DELETING PACKAGES"
        set unlisted_packages (get_unlisted_packages --wanted-packages "$std_packages $aur_packages")
        sudo pacman -Rns $unlisted_packages

        set enabled_services (fd -e service . /etc/systemd/system/*.wants -x basename | string replace -r '\.service$' '')
        set services_to_disable

        for enabled_service in $enabled_services
            if contains $enabled_service $services
                continue
            end

            set -a services_to_disable $enabled_service
        end

        for service_to_disable in $services_to_disable
            echo "[INFO] DISABLING SERVICE | SERVICE={$service_to_disable}"
            sudo systemctl disable $service_to_disable
        end
    case check
        set missing_packages (get_missing_packages --wanted-packages "$std_packages $aur_packages")

        if set -q missing_packages[1]
            echo "Missing packages: $packages_not_found"
        end

        set unlisted_packages (get_unlisted_packages --wanted-packages "$std_packages $aur_packages")

        if set -q unlisted_packages[1]
            echo "Packages not defined: $unlisted_packages"
        end
    case help
        echo "USAGE: COMMAND HOST_PATHNAME_1 HOST_PATHNAME_2 ... HOST_PATHNAME_9"
        echo COMMANDS
        echo "-> install"
        echo "In the following order it installs: packages, files and services."
        echo "-> cleanup"
        echo "Removes unlisted packages."
        echo "-> uninstall"
        echo "Removes files."
        echo "-> check"
        echo "Verifies the configuration is setup."
end
