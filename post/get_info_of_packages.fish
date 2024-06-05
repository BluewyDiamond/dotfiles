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
    set packages (jq -r '.common | .. | .std? // empty | .[]] + [.. | .aur? // empty | .[]] | unique | .[]' packages.json | sort -u)

    set installed (pacman -Qqe | sort -u)


    for pkg in $installed
        if not contains $pkg $packages
            echo $pkg
        end
    end
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
