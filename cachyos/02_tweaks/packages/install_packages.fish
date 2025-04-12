#!/usr/bin/env fish

set current_dir (dirname (realpath (status --current-filename)))
set config_path "$current_dir/lib/packages.json"
set script_name (basename (status filename))

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

function print_chosen_repository_from_json_file
    set top_level_key $argv[1]
    set repository $argv[2]

    if test -z (string trim $repository)
        print "string is empty or contains only spaces"
        return 1
    end

    set packages (jq -r ".\"$top_level_key\".\"$repository\"? | select(. != null) | join(\" \")" $config_path)

    if test -z (string trim "$packages")
        return 1
    end

    echo $packages
end

# This section is for utils stuff.
#
function print_horizontal_line
    set width (tput cols)

    for x in (seq 1 $width)
        echo -n -
    end

    echo ""
end

# main
#
if not which pacman 2&>/dev/null
    print "pacman not found, exiting..."
    exit 1
end

if not which paru 2&>/dev/null
    print "paru not found... Attempting to obtain it through pacman."
    sudo pacman -S --needed paru; or exit 1
end

if not test -e $config_path
    print "config file not found, exiting..."
    exit 1
end

if not which jq 2&>/dev/null
    print "jq not found... Attempting to obtain it through pacman."
    sudo pacman -S --needed jq; or exit 1
end

set top_level_keys (jq -r 'keys | .[]' $config_path)
set top_level_keys_count (count $top_level_keys)
print "Select configurations to install [1 2 3 ...]"

for index in (seq $top_level_keys_count)
    print "$index. $top_level_keys[$index]"
end

set choices (scan)

for choice in (string split " " $choices)
    if not string match -qr '^[0-9]+$' -- "$choice"
        continue
    end

    if test "$choice" -le 0 -o "$choice" -gt $top_level_keys_count
        continue
    end

    set -a curated_configs $top_level_keys[$choice]
end

if not set -q curated_configs[1]
    print "Invalid values..."
    exit 1
end

for curated_config in $curated_configs
    set -a common_standard_repository (string split " " (print_chosen_repository_from_json_file $curated_config std))
    set -a common_arch_user_repository (string split " " (print_chosen_repository_from_json_file $curated_config aur))
end

sudo pacman -Syy
sudo pacman -S --needed $common_standard_repository
paru -S --aur --needed $common_arch_user_repository
