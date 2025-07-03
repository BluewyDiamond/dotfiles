#!/usr/bin/env fish

source ./is_package_a_dependency__bool.fish

set target_packages (./get_any_target_packages__arr.fish)
set installed_aur_packages (pacman -Qqme)

for installed_aur_package in $installed_aur_packages
    if contains $installed_aur_package $target_packages
        continue
    end

    if is_package_a_dependency $installed_package
        continue
    end

    echo $installed_aur_package
end
