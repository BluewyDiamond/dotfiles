#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

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
set target_services

# ignore this packages
set -a std_packages $required_packages

# partial acquisition of data (acquisition of global data)

for host_pathname in $hosts_pathnames
    set -a common_packages_pathnames (tomlq -r '(.common_packages // [])[]' $host_pathname)
    set -a std_packages (tomlq -r '[.packages // {} | .. | objects | .std // []] | add | .[]' $host_pathname)
    set -a aur_packages (tomlq -r '[.packages // {} | .. | objects | .aur // []] | add | .[]' $host_pathname)
    set -a target_services (tomlq -r ".services.enable // [] | .[]" $host_pathname)
end

for common_package_filepath in $common_packages_pathnames
    set -a std_packages (tomlq -r '.std // [] | .[]' $script_dir/$common_package_filepath)
    set -a aur_packages (tomlq -r '.aur // [] | .[]' $script_dir/$common_package_filepath)
end

# action based on the data

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

function is_package_a_dependency
    set package $argv[1]
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
    set wanted_packages $argv
    set installed_packages (pacman -Qqe)

    for installed_package in $installed_packages
        if contains $installed_package $wanted_packages
            continue
        end

        if is_package_a_dependency $installed_package
            continue
        end

        echo $installed_package
    end
end

switch $argv[1]
    case install
        echo "[INFO] INSTALL STD PACKAGES"
        set missing_std_packages

        for std_package in $std_packages
            if pacman -Q $std_package 2&>/dev/null
                continue
            end

            set -a missing_std_packages $std_packages
        end

        if set -q missing_std_packages[1]
            sudo pacman -S $std_packages
        else
            echo "[INFO] SKIP | ALREADY INSTALLED"
        end

        echo "[INFO] INSTALL AUR PACKAGES"
        set missing_aur_packages

        for aur_package in $aur_packages
            if pacman -q $aur_package 2&>/dev/null
                continue
            end

            set -a missing_aur_packages $aur_package
        end

        if set -q missing_aur_package[1]
            paru -S --aur $aur_packages
        else
            echo "[INFO] SKIP | ALREADY INSTALLED"
        end

        for host_pathname in $hosts_pathnames
            set install_files_length (tomlq -r '.install_files // [] | length' $host_pathname)
            set spawn_files_length (tomlq -r '.spawn_files // [] | length' $host_pathname)

            for install_file_index in (seq 0 (math $install_files_length - 1))
                set owner (tomlq -r ".install_files[$install_file_index].owner" $host_pathname)

                set operation (switch (tomlq -r ".install_files[$install_file_index].operation" $host_pathname)
                   case 'link'
                      echo -e "ln\n-s"
                   case 'copy'
                      echo "cp"
                   end
                )

                set source $script_dir/(tomlq -r ".install_files[$install_file_index].source" $host_pathname)
                set target_dir_use_regex (tomlq -r ".install_files[$install_file_index].target_dir_use_regex // false" $host_pathname)
                set target_dir (tomlq -r ".install_files[$install_file_index].target_dir" $host_pathname)
                set fd_results

                switch $target_dir_use_regex
                    case true
                        set fd_results (fd --regex $target_dir)
                    case false
                        set fd_results $target_dir
                end

                set targets

                for fd_result in $fd_results
                    set -a targets $fd_result/(basename $source)
                end

                echo "[INFO] INSTALL FILE | OWNER={$owner} OPERATION={$operation} SOURCE={$source}"

                for target in $targets
                    echo "[INFO] TARGET={$target}"

                    switch "$operation"
                        case cp
                            if test -f $target
                                if test "$content" = (cat $target | string collect)
                                    echo "[INFO] SKIP | MATCHING FILE FOUND"
                                    continue
                                end

                                echo "[WARN] TRASH TARGET | CONFLICTING FILE FOUND | TARGET={$target}"
                                sudo -iu $owner -- trash $target
                            end

                            sudo -iu $owner -- $operation $source $target
                        case 'ln -s'
                            if test (readlink -f $target) = $source
                                echo "[INFO] SKIP | MATCHING LINK FOUND"
                                continue
                            end

                            echo "[WARN] TRASH TARGET | CONFLICT FOUND | TARGET={$target}"
                            sudo -iu $owner -- trash $target
                        case '*'
                            echo "[INFO] SKIP | UNIMPLEMENTED OPERATION | OPERATION={$operation}"
                    end
                end
            end

            for spawn_file_index in (seq 0 (math $spawn_files_length - 1))
                set owner (tomlq -r ".spawn_files[$spawn_file_index].owner" $host_pathname)
                set target (tomlq -r ".spawn_files[$spawn_file_index].target" $host_pathname)
                set content (tomlq -r ".spawn_files[$spawn_file_index].content" $host_pathname | string collect)

                echo "[INFO] SPAWN FILE | TARGET={$target}"

                set target_content (cat $target | string collect)

                if test -f $target
                    if test "$content" = "$target_content"
                        echo "[INFO] SKIP | MATCHING FILE FOUND"
                        continue
                    end

                    echo "[WARN] TRASH TARGET | CONFLICTING FILE FOUND | TARGET={$target}"
                    sudo -iu $owner -- trash $target
                end

                if test -d $target
                    echo "[WARN] TRASH TARGET | CONFLICTING DIRECTORY FOUND | TARGET={$target}"
                    sudo -iu $owner -- trash (dirname $target)
                    echo "[INFO] CREATE DIRECTORY | DIRECTORY={$target}"
                    sudo -iu $owner -- mkdir -p (dirname $target)
                end

                if test -L $target
                    echo "[WARN] TRASH TARGET | CONFLICTING LINK FOUND | TARGET={$target}"
                    sudo -iu $owner -- trash $target
                end

                sudo -iu $owner -- echo $content >$target
            end
        end

        set enabled_services (fd -e service . /etc/systemd/system/*.wants -x basename | string replace -r '\.service$' '')
        set services_to_enable

        for target_service in $target_services
            if contains $target_service $enabled_services
                echo "[INFO] SKIP | ALREADY ENABLED | SERVICE={$target_service}"
                continue
            end

            set -a services_to_enable $target_service
        end

        for service_to_enable in $services_to_enable
            echo "[INFO] ENABLE SERVICE | SERVICE={$service_to_enable}"
            sudo systemctl enable $service_to_enable
        end
    case cleanup
        set unlisted_packages (get_unlisted_packages $std_packages $aur_packages)
        echo "DELETE:"
        echo $unlisted_packages
        sudo pacman -Rns $unlisted_packages
    case check
        set packages_not_found

        for package in $std_packages $aur_packages
            if not pacman -Q $package 2&>/dev/null
                set -a packages_not_found $package
            end

            continue
        end

        if set -q packages_not_found[1]
            echo "Missing packages: $packages_not_found"
            exit 1
        end

        echo "All good, Nothing to do!"
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
