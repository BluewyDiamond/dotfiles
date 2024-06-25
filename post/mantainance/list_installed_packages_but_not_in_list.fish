#!/usr/bin/env fish

function main
    set listed_packages (jq -r '[.common | .. | .std? // empty | .[]] + [.common | .. | .aur? // empty | .[]] | unique | .[]' ../packages.json | sort -u)

    set installed_packages (pacman -Qqe | sort -u)

    for installed_package in $installed_packages
        if contains $installed_package $listed_packages
            continue
        end

        if is_package_a_dependency $installed_package
            continue
        end

        echo $installed_package
    end
end

function is_package_a_dependency
    set package $argv[1]

    if not pactree -r $package >/dev/null
        return 1
    end

    set pactree_output_line_count (pactree -r $package | wc -l)

    switch $pactree_output_line_count
        case 1
            return 1
        case '*'
            return 0
    end

    return 1
end

###################
main
