#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/../setup-utils/lib.fish

set script_name (path basename (status filename))

set unlisted_installed_std_packages_to_remove ($script_dir/lib/get_unlisted_installed_std_packages__arr.fish)
echo $unlisted_installed_std_packages_to_remove
echo "Clean up the above? [y/N]"
set should_remove_unlisted_installed_std_packages (scan N "INPUT: ")

set unlisted_installed_aur_packages_to_remove ($script_dir/lib/get_unlisted_installed_aur_packages__arr.fish)
echo $unlisted_installed_aur_packages_to_remove
echo "Do you wish to also clean up the AUR packages above? [y/N]"
set should_remove_unlisted_installed_aur_packages (scan N "INPUT: ")

# update the below logic

if string match -q -i -- Y "$should_remove_unlisted_installed_std_packages"
    set -a unlisted_installed_any_packages_to_remove $unlisted_installed_std_packages_to_remove
end

if string match -q -i -- Y "$should_remove_unlisted_installed_aur_packages"
    set -a unlisted_installed_any_packages_to_remove $unlisted_installed_aur_packages_to_remove
end

if not set -q unlisted_installed_any_packages_to_remove
    echo "Nothing to do..."
    exit 1
end

sudo pacman -Rns -- $unlisted_installed_any_packages_to_remove
sudo chwd -a -f
