#!/usr/bin/env fish

echo "script: reset fish?"
read -P "script => Input -- " choice

if string match -q -i -- $choice y
    # prepare fish config directory
    rm -r $HOME/.config/fish
    mkdir $HOME/.config/fish
    mkdir $HOME/.config/fish/conf.d
    mkdir $HOME/.config/fish/functions
    mkdir $HOME/.config/fish/themes
end


echo "script: stow?"
read -P "script => Input -- " choice

if string match -q -i -- $choice y
    sudo pacman -S --needed stow

    pushd ./link/stow

    for module in *
        stow $module -t $HOME
    end

    popd
end


echo "script: proceed with manual stuff to link?"
read -P "script => Input -- " choice

if string match -q -i -- $choice y
    mkdir -p $HOME/.cachy

    ln -sf $PWD/link/manual/cachy-browser/cachy.overrides.cfg $HOME/.cachy/cachy.overrides.cfg

    set target_dirs (find $HOME/.cachy -type d -name '*default-release' 2>/dev/null)

    for dir in $target_dirs
        if not test -d "$dir/chrome"
            mkdir -p "$dir/chrome"
        end

        ln -sf $PWD/link/manual/cachy-browser/userChrome.css "$dir/chrome"
    end
end
