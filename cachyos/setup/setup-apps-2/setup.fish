#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

# some requirements

set required_packages jq paru trash-cli fd
set required_packages_to_install

for required_package_to_install in $required_packages
    if not pacman -Q $required_package_to_install 2&>/dev/null
        set -a required_packages_to_install $required_package_to_install
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
set file_lines
set services_to_enable

# acquisition of data

for host_pathname in $hosts_pathnames
    set -a common_packages_pathnames (jq -r '.common_packages[] // []' $host_pathname)
    set -a std_packages (jq -r '.packages.std // [] | .[]' $host_pathname)
    set -a aur_packages (jq -r '.packages.aur // [] | .[]' $host_pathname)
    set -a file_lines (jq -r '.files.files // [] | .[] | "\(.owner) \(.operation) \(.source) \(.target_dir)"' $host_pathname)
    set -a services_to_enable (jq -r ".services.enable // [] | .[]" $host_pathname)
end

for common_package_filepath in $common_packages_pathnames
    set -a std_packages (jq -r '.std // [] | .[]' $script_dir/$common_package_filepath)
    set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/$common_package_filepath)
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
    set pactree_noutput (pactree -r $package)

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
        sudo pacman -S --needed $std_packages && paru -S --aur $aur_packages

        for line in $file_lines
            set splitted_line (string split ' ' $line)
            set owner $splitted_line[1]
            set operation $splitted_line[2]
            set source $splitted_line[3]
            set fd_results (fd --regex $splitted_line[3])
            set targets

            for fd_result in $fd_results
                set -a targets $fd_result/(basename $source)
            end

            for target in $targets
                sudo -iu $owner prepare $target
                sudo -iu $owner $operation $source $target
            end
        end

        for service_to_enable in $services_to_enable
            systemctl enable $service_to_enable
        end
    case cleanup
        # set unlisted_packages (get_unlisted_packages $std_packages $aur_packages)
        get_unlisted_packages $std_packages $aur_packages
        # sudo pacman -Rns $unlisted_packages
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
