#!/usr/bin/env fish

set -g SCRIPT_NAME (basename (status -f))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
end

function input
    set_color magenta
    read -P (set_color magenta)"INPUT => "(set_color yellow) choice
    set_color normal
end

prompt "Do you want to reset fish shell config? [y/N]"
input

if string match -q -i -- $choice y
    # prepare fish config directory
    rm -r $HOME/.config/fish
    mkdir $HOME/.config/fish
    mkdir $HOME/.config/fish/conf.d
    mkdir $HOME/.config/fish/functions
    mkdir $HOME/.config/fish/themes
end

prompt "Proceed with linking files with stow? [y/N]"
input

if string match -q -i -- $choice y
    sudo pacman -S --needed stow

    pushd ./link/stow

    for module in *
        stow $module -t $HOME
    end

    popd
end


prompt "Proceed with linking files manually by the script? [y/N]"
input

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
