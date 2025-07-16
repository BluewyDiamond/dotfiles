#!/usr/bin/env fish

source ../setup-utils/lib.fish

set script_name (basename (status filename))
set script_dir (dirname (realpath (status --current-filename)))
set config_path $script_dir/lib/packages.json

function print
    set_color magenta
    echo -n "$script_name => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function get_array_of_packages
    set top_level_key $argv[1]
    set repository $argv[2]

    set packages (jq -r ".\"$top_level_key\".\"$repository\"? | select(. != null) | join(\" \")" $config_path)
    string split ' ' $packages
end

# main
#
if not which pacman 2&>/dev/null
    echo (set_color red)"ERROR: "(set_color normal)"Missing dependency... |pacman|"
    exit 1
end

if not which paru 2&>/dev/null
    echo (set_color yellow)"WARNING: "(set_color normal)"Missing dependency... |paru| Attempting to obtain it."
    sudo pacman -S --noconfirm --needed paru; or exit 1
end

if not test -e $config_path
    echo (set_color red)"ERROR:"(set_color normal)"Invalid file... |config_path=$config_path|"
    exit 1
end

if not which jq 2&>/dev/null
    echo (set_color yellow)"WARNING: "(set_color normal)"Missing dependency... |jq| Attempting to obtain it."
    sudo pacman -S --needed jq; or exit 1
end

set top_level_keys (jq -r 'keys | .[]' $config_path)
set top_level_keys_count (count $top_level_keys)
echo "Select configurations to install. Example: [1 2 3 ...]"

for index in (seq $top_level_keys_count)
    print "$index. $top_level_keys[$index]"
end

set choices (scan N "INPUT: ")

for choice in (string split " " $choices)
    if not string match -qr -- '^[0-9]+$' "$choice"
        echo (set_color yellow)"WARNING: "(set_color normal)"Invalid value... |choice=$choice| Skipping..."
        continue
    end

    if test "$choice" -le 0 -o "$choice" -gt $top_level_keys_count
        echo (set_color yellow)"WARNING: "(set_color normal)"Out of range... |choice=$choice| Skipping..."
        continue
    end

    set -a curated_configs $top_level_keys[$choice]
end

if not set -q curated_configs[1]
    echo (set_color blue)"INFO: "(set_color normal)"Nothing to do..."
    exit 1
end

for curated_config in $curated_configs
    set -a standard_packages (get_array_of_packages $curated_config std)
    set -a aur_packages (get_array_of_packages $curated_config aur)
end

if set -q standard_packages[1]
    sudo pacman -Syy --needed -- $standard_packages
end

if set -q aur_packages[1]
    paru -S --aur --needed -- $aur_packages
end
