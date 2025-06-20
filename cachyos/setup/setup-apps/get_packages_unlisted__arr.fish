#!/usr/bin/env fish

function is_package_a_dependency
    set package $argv[1]
    set pactree_output (pactree -r $package)

    if test $status -eq 1
        return 1
    end

    set pactree_output_line_count (count $pactree_output)

    if test $pactree_output_line_count -ge 2
        return 0
    else
        return 1
    end
end

set packages (./get_packages__arr.fish)
set installed_packages (pacman -Qqe)
set aur_packages (pacman -Qqme)

for installed_package in $installed_packages
    if contains $installed_package $aur_packages
        continue
    end

    if contains $installed_package $packages
        continue
    end

    if is_package_a_dependency $installed_package
        continue
    end

    echo $installed_package
end
