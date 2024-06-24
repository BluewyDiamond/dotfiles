#!/usr/bin/env fish

function main
    echo "1. Packages installed but not in JSON list"
    echo "2. JSON list packages not installed"

    read -P "script => Input -- " choice

    echo

    switch $choice
        case 1
            not_in_json
        case 2
            in_json
        case '*'
            echo "script: not an option..."
    end
end

function not_in_json
    set listed_packages (jq -r '[.common | .. | .std? // empty | .[]] + [.common | .. | .aur? // empty | .[]] | unique | .[]' packages.json | sort -u)

    set installed_packages (pacman -Qqe | sort -u)

    set exclude_patterns 'alsa-*'

    for installed_package in $installed_packages
        if not contains $installed_package $listed_packages
            if not has_pattern $exclude_patterns $installed_package
                echo $installed_package
            end
        end
    end
end

function has_pattern
    set exclude_patterns $argv[1..-2]
    set installed_package $argv[-1]

    for exclude_pattern in $exclude_patterns
        if string match -q -g $exclude_pattern $installed_package
            return 0
        end
    end

    return 1
end

function in_json
    set json_packages (jq -r '.common | .. | (.std? // empty) [], (.aur? // empty) []' packages.json | sort -u)

    set explicitly_installed (pacman -Qq | sort -u)

    for pkg in $json_packages
        if not contains $pkg $explicitly_installed
            echo $pkg
        end
    end
end

####################
main
