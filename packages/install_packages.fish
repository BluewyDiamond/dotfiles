#!/usr/bin/env fish

set -g CONFIG_FILE_NAME "packages.json"
set -g CONFIG_LOCATION "./"
set -g CONFIG_FULL_PATH "$CONFIG_LOCATION$CONFIG_FILE_NAME"

function main
    prerequisites

    set common_standard_repository (string split " " (print_chosen_repository_at_common_from_json_file std))
    set common_arch_user_repository (string split " " (print_chosen_repository_at_common_from_json_file aur))
    set specific_hardware_standard_repository
    set specific_hardware_arch_user_repository

    print_horizontal_line
    echo "script => What CPU brand does this PC use?"
    echo "1. AMD"
    echo "2. Intel"
    read -P "script => Input -- " cpu_value

    switch $cpu_value
        case 1
            set specific_hardware_standard_repository (string split " " (print_chosen_repository_and_specific_hardware_from_json_file std amd_cpu))
            set specific_hardware_arch_user_repository (string split " " (print_chosen_repository_and_specific_hardware_from_json_file aur amd_cpu))
        case 2
            echo "script: not yet implemented!"
        case '*'
            echo "script: out of range..."
    end

    print_horizontal_line
    echo "script => What GPU brand does this PC use?"
    echo "1. AMD"
    echo "2. Intel"
    echo "3. Nvidia"
    read -P "script => Input -- " gpu_value

    switch $gpu_value
        case 1
            set specific_hardware_standard_repository $specific_hardware_standard_repository (string split " " (print_chosen_repository_and_specific_hardware_from_json_file std amd_gpu))
            set specific_hardware_arch_user_repository $specific_hardware_arch_user_repository (string split " " (print_chosen_repository_and_specific_hardware_from_json_file aur amd_gpu))
        case 2
            echo "script: not yet implemented!"
        case 3
            echo "script: not yet implemented!"
        case '*'
            echo "script: out of range..."
    end

    print_horizontal_line
    sudo pacman -S --needed $common_standard_repository $specific_hardware_standard_repository
    paru -S --aur --needed $common_arch_user_repository $specific_hardware_arch_user_repository
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

    if not which jq >/dev/null
        echo "script: jq not found, exiting..."
        exit 1
    end
end

function print_chosen_repository_at_common_from_json_file
    set repository $argv[1]

    if test -z (string trim $repository)
        echo "bluewy: string is empty or contains only spaces"
        set function_name (status current-command)
        echo "bluewy: @$function_name"
        return 1
    end

    set raw (jq -r ".common | .. | .$repository? | select(. != null) | join(\" \")" $CONFIG_FULL_PATH)

    if test -z (string trim "$raw")
        return 1
    end

    echo $raw
end

function print_chosen_repository_and_specific_hardware_from_json_file
    set repository $argv[1]

    if test -z (string trim $repository)
        echo "script: string is empty or contains only spaces"
        set function_name (status current-command)
        echo "script: @$function_name"
        return 1
    end

    set hardware_type $argv[2]

    if test -z (string trim $hardware_type)
        echo "script: string is empty or contains only spaces"
        set function_name (status current-command)
        echo "script: @$function_name"
        return 1
    end

    set raw (jq -r ".hardware_specific.$hardware_type | .. | .$repository? | select(. != null) | join(\" \")" $CONFIG_FULL_PATH)

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
