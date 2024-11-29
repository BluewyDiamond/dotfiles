#!/usr/bin/env fish

set -g SCRIPT_NAME (basename (status filename))
set WORKING_DIRECTORY /tmp/$SCRIPT_NAME

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

function install_cachyos_repos
    if test -d $WORKING_DIRECTORY
        rm -r $WORKING_DIRECTORY
    end

    mkdir $WORKING_DIRECTORY
    pushd $WORKING_DIRECTORY

    curl https://mirror.cachyos.org/cachyos-repo.tar.xz -o cachyos-repo.tar.xz
    tar xvf cachyos-repo.tar.xz && cd cachyos-repo
    sudo ./cachyos-repo.sh
    popd
end

function uninstall_cachyos_repos
    if test -d $WORKING_DIRECTORY
        rm -r $WORKING_DIRECTORY
    end

    mkdir $WORKING_DIRECTORY
    pushd $WORKING_DIRECTORY

    sudo pacman -S core/pacman
    wget https://build.cachyos.org/cachyos-repo.tar.xz
    tar xvf cachyos-repo.tar.xz
    cd cachyos-repo
    sudo ./cachyos-repo.sh --remove
    popd
end

function reinstall_minimal
    set packages_minimal \
        base base-devel linux-cachyos linux-firmware \
        refind fish bash sudo neovim \
        cachyos-keyring cachyos-hooks cachyos-mirrorlist cachyos-v3-mirrorlist cachyos-v4-mirrorlist cachyos-rate-mirrors cachyos-settings \
        fisher git eza pacman-contrib paru fastfetch chwd iwd plymouth terminus-font less

    set packages_aur (pacman -Qqm)
    set packages_standard (pacman -Qq)
    set packages_to_remove

    for package_standard in $packages_standard
        if contains $package_standard $mimimal_packages
            continue
        end

        set dependant_packages (pactree -l -r $package_standard)
        set can_remove yes

        for dependant_pkg in $dependant_packages
            if contains $dependant_pkg $packages_minimal
                set can_remove no
                break
            end

            if contains $dependant_pkg $aur_packagees
                set can_remove no
                break
            end
        end

        if string match -i -q -- yes $can_remove
            set packages_to_remove $packages_to_remove $package_standard
        end
    end

    echo "↓↓↓"
    echo $packages_to_remove
    echo "↑↑↑"

    prompt "Proceed removal?"
    set choice (input)

    if string match -i -q -- y $choice
        if test -n "$packages_to_remove"
            sudo pacman -Rns $packages_to_remove
        else
            prompt "No packages to remove..."
        end

        chwd -a -f
        sudo pacman -Syu $packages_minimal
    end
end

function main
    prompt "Choose on of the following options:"
    prompt "1. Reinstall Mimimal"
    prompt "2. Reinstall CachyOS Repositories"

    set choice (input)

    switch $choice
        case 1
            reinstall_minimal
            sudo chwd -a -f
        case 2
            uninstall_cachyos_repos
            install_cachyos_repos
        case '*'
            prompt "Not a valid choice..."
    end
end

###################
main

# 1. Removes non specified packages except for aur packages
# 2. Force install hardware drivers/software
# 3. Reinstall all specified/minimal packages
