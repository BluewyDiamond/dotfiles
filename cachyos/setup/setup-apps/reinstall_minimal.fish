#!/usr/bin/env fish

source ../setup-utils/lib.fish

set script_name (path basename (status filename))
set pkgs_to_remove (./get_packages_unlisted__arr.fish)
echo $pkgs_to_remove
echo "Remove the above? [y/N]"

set choice (scan N "INPUT: ")

if not string match -q -i -- Y "$choice"
    exit 1
end

sudo pacman -Rns -- $pkgs_to_remove
sudo chwd -a -f
