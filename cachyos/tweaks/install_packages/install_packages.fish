#!/usr/bin/env fish

set -g CONFIG_FILE_NAME "packages.json"
set -g CONFIG_LOCATION (dirname (status -f))/./
set -g CONFIG_FULL_PATH "$CONFIG_LOCATION/$CONFIG_FILE_NAME"

set -g SCRIPT_NAME (basename (status -f))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) $value
    echo $value
end

function main
    prerequisites
    sudo pacman -S --needed jq
    set top_level_keys (jq -r 'keys | .[]' $CONFIG_FULL_PATH)
    prompt "Select configurations to install [1 2 3 ...]"

    for i in (seq (count $top_level_keys))
        echo "$i. $top_level_keys[$i]"
    end

    set config_choices (input)

    set chosen_configs (for choice in (string split " " $config_choices)
        if test $choice -ge 1 -a $choice -le (count $top_level_keys)
            echo $top_level_keys[$choice]
        else
            prompt "choice $choice is out of range, ignoring..."
        end
    end)


    for config in $chosen_configs
        set common_standard_repository $common_standard_repository (string split " " (print_chosen_repository_from_json_file $config std))
        set common_arch_user_repository $common_arch_user_repository (string split " " (print_chosen_repository_from_json_file $config aur))
    end

    sudo pacman -S --needed $common_standard_repository

    sudo pacman -S --needed paru

    paru -S --aur --needed $common_arch_user_repository
end

function prerequisites
    if not which pacman >/dev/null
        prompt "pacman package manager not found, exiting..."
        exit 1
    end

    if not which paru >/dev/null
        prompt "paru not found, exiting..."
        exit 1
    end

    if not test -e $CONFIG_FULL_PATH
        prompt "config file not found, exiting..."
        return 1
    end
end

function print_chosen_repository_from_json_file
    set repository $argv[2]
    set config $argv[1]

    if test -z (string trim $repository)
        prompt "string is empty or contains only spaces"
        set function_name (status current-command)
        prompt "@$function_name"
        return 1
    end

    set raw (jq -r ".\"$config\" | .. | .$repository? | select(. != null) | join(\" \")" $CONFIG_FULL_PATH)

    if test -z (string trim "$raw")
        return 1
    end

    echo $raw
end

# This section is for utils stuff.

function print_horizontal_line
    set width (tput cols)

    for x in (seq 1 $width)
        echo -n -
    end

    echo ""
end

# --------------------
main $argv
