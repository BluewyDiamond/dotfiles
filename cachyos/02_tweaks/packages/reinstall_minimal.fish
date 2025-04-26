#!/usr/bin/env fish

# global
#
set script_name (path basename (status filename))

# utils
#
function print
    set_color magenta
    echo -n "$script_name => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function scan
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

# main
set pkgs_to_remove (./lib/get_packages_unlisted__arr.fish)
print $pkgs_to_remove
print "Remove the above? [y/N]"

set choice (scan N)

if not string match -q -i -- Y "$choice"
    exit 1
end

sudo pacman -Rns -- $pkgs_to_remove
sudo chwd -a -f
