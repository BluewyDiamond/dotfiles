#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))

source $script_dir/is_package_a_dependency__bool.fish

set any_target_packages ($script_dir/get_any_target_packages__arr.fish)
set installed_any_packages (pacman -Qqe)
set installed_aur_packages (pacman -Qqme)

for installed_std_package in $installed_any_packages
    if contains $installed_std_package $installed_aur_packages
        continue
    end

    if contains $installed_std_package $any_target_packages
        continue
    end

    if is_package_a_dependency $installed_std_package
        continue
    end

    echo $installed_std_package
end
