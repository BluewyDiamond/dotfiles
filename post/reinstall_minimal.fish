#!/usr/bin/env

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

set minimal_packages base base-devel linux-cachyos linux-firmware refind fish bash sudo neovim cachyos-keyring cachyos-hooks cachyos-mirrorlist cachyos-v3-mirrorlist cachyos-v4-mirrorlist cachyos-rate-mirrors cachyos-settings

function install_cachyos_repos
    curl https://mirror.cachyos.org/cachyos-repo.tar.xz -o cachyos-repo.tar.xz
    tar xvf cachyos-repo.tar.xz && cd cachyos-repo
    sudo ./cachyos-repo.sh
end

function uninstall_cachyos_repos
    sudo pacman -S core/pacman
    wget https://build.cachyos.org/cachyos-repo.tar.xz
    tar xvf cachyos-repo.tar.xz
    cd cachyos-repo
    sudo ./cachyos-repo.sh --remove
end

function main
    set all_installed (pacman -Qq)

    set packages_to_remove

    for pkg in $all_installed
        if not contains $pkg $minimal_packages
            set packages_to_remove $packages_to_remove $pkg
        end
    end

    if test -n "$packages_to_remove"
        sudo pacman -Rns $packages_to_remove
    else
        prompt "No packages to remove..."
    end

    sudo pacman -Syu $minimal_packages
end

###################
main
