#!/usr/bin/env fish

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

set minimal_packages \
    base base-devel linux-cachyos linux-firmware \
    refind fish bash sudo neovim \
    cachyos-keyring cachyos-hooks cachyos-mirrorlist cachyos-v3-mirrorlist cachyos-v4-mirrorlist cachyos-rate-mirrors cachyos-settings \
    fisher git eza pacman-contrib paru fastfetch chwd iwd

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
    set all_packages (pacman -Qq)

    set packages_to_remove

    for pkg in $all_packages
        if contains $pkg $mimimal_packages
            continue
        end

        set dependant_packages (pactree -l -r $pkg)
        set can_remove yes

        for dependant_pkg in $dependant_packages
            if contains $dependant_pkg $minimal_packages
                set can_remove no
                break
            end
        end

        if string match -i -q -- yes $can_remove
            set packages_to_remove $packages_to_remove $pkg
        end
    end

    echo "↓↓↓"
    echo $packages_to_remove
    echo "↑↑↑"

    prompt "Proceed removal?"
    set choice (input)

    if string match -i -q -- $choice y
        if test -n "$packages_to_remove"
            sudo pacman -Rns $packages_to_remove
        else
            prompt "No packages to remove..."
        end

        sudo pacman -Syu $minimal_packages
    end
end

###################
main
