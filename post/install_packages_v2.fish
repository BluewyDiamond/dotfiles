#!/usr/bin/env fish

set -g CONFIG_FILE_NAME "packages2.json"
set -g CONFIG_LOCATION ./packages
set -g CONFIG_FULL_PATH "$CONFIG_LOCATION/$CONFIG_FILE_NAME"

function main
    prerequisites

    sudo pacman -S --needed jq

    set top_level_keys (jq -r 'keys | .[]' $CONFIG_FULL_PATH)

    echo "script => Select the configuration(s) to use (e.g., 1 3 5):"
    for i in (seq (count $top_level_keys))
        echo "$i. $top_level_keys[$i]"
    end

    read -P "script => Input -- " config_choices

    set chosen_configs (for choice in (string split " " $config_choices)
        if test $choice -ge 1 -a $choice -le (count $top_level_keys)
            echo $top_level_keys[$choice]
        else
            echo "script: choice $choice is out of range, ignoring..."
        end
    end)


    for config in $chosen_configs
        set common_standard_repository $common_standard_repository (string split " " (print_chosen_repository_from_json_file $config std))
        set common_arch_user_repository $common_arch_user_repository (string split " " (print_chosen_repository_from_json_file $config aur))
    end

    print_horizontal_line
    sudo pacman -S --needed $common_standard_repository

    sudo pacman -S --needed paru

    paru -S --aur --needed $common_arch_user_repository
end

function prerequisites
    if not which pacman >/dev/null
        echo "script: pacman package manager not found, exiting..."
        exit 1
    end

    if not which paru >/dev/null
        echo "script: paru not found, exiting..."
        exit 1
    end

    if not test -e $CONFIG_FULL_PATH
        echo "script: config file not found, exiting..."
        return 1
    end
end

function print_chosen_repository_from_json_file
    set repository $argv[2]
    set config $argv[1]

    if test -z (string trim $repository)
        echo "script: string is empty or contains only spaces"
        set function_name (status current-command)
        echo "script: @$function_name"
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
