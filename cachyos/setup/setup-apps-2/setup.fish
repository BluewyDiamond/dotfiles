#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))
set hosts_filepaths $argv[2..-1]
set common_packages_filepaths
set std_packages
set aur_packages
set file_lines

for host_filepath in $hosts_filepaths
    set -a common_packages_filepaths (jq -r '.common_packages[] // []' $host_filepath)
    set -a std_packages (jq -r '.packages.std // [] | .[]' $host_filepath)
    set -a aur_packages (jq -r '.packages.aur // [] | .[]' $host_filepath)
    set -a file_lines (jq -r '.files.files[] | "\(.operation) \(.source) \(.target)"' $host_filepath)
end

for common_package_filepath in $common_packages_filepaths
    set -a std_packages (jq -r '.std // [] | .[]' $script_dir/$common_package_filepath)
    set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/$common_package_filepath)
end

function install
    sudo pacman -S --needed $std_packages paru && paru -S --aur $aur_packages

    function process
        set operation $argv[1]
        set source $argv[2]
        set targets (fd --regex $argv[3])
        set sudo $argv[4]

        if test $sudo = true
            switch $operation
                case copy
                    for target in $targets
                        sudo cp -r $source $target/(basename $source)
                    end
                case link
                    for target in $targets
                        sudo ln -s $source $target/(basename $source)
                    end
            end
        else
            switch $operation
                case copy
                    for target in $targets
                        cp -r $source $target/(basename $source)
                    end
                case link
                    for target in $targets
                        ln -s $source $target/(basename $source)
                    end
            end
        end
    end
end

function cleanup
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
        set any_target_packages $argv
        set installed_any_packages (pacman -Qqe)

        for installed_std_package in $installed_any_packages
            if contains $installed_std_package $any_target_packages
                continue
            end

            if is_package_a_dependency $installed_std_package
                continue
            end

            echo $installed_std_package
        end
    end

    set unlisted_packages (get_unlisted_packages $std_packages $aur_packages)
    sudo pacman -Rns $unlisted_packages
end

switch $argv[1]
    case install
        install
    case cleanup
        cleanup
end
