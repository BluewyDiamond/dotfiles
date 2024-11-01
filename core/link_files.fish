#!/usr/bin/env fish

set SCRIPT_NAME (basename (status -f))
set STOWABLE_PACKAGES (dirname (status -f))/../link/stow
set CACHY_BROWSER_OVERRIDES (dirname (status -f))/../link/manual/cachy-browser/cachy.overrides.cfg
set CACHY_BROWSER_CSS (dirname (status -f))/../link/manual/cachy-browser/userChrome.css

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


prompt "Do you want to reset fish shell config? [y/N]"
set choice (input)

if string match -q -i -- $choice y
    # prepare fish config directory
    rm -r $HOME/.config/fish
    mkdir $HOME/.config/fish
    mkdir $HOME/.config/fish/conf.d
    mkdir $HOME/.config/fish/functions
    mkdir $HOME/.config/fish/themes
end

prompt "Proceed with linking files with stow? [y/N]"
set choice (input)

if string match -q -i -- $choice y
    sudo pacman -S --needed stow

    pushd $STOWABLE_PACKAGES

    for module in *
        stow $module -t $HOME
    end

    popd
end


prompt "Proceed with linking files manually by the script? [y/N]"
set choice (input)

if string match -q -i -- $choice y
    mkdir -p $HOME/.cachy

    ln -sf $CACHY_BROWSER_OVERRIDES $HOME/.cachy/cachy.overrides.cfg

    set target_dirs (find $HOME/.cachy -type d -name '*default-release' 2>/dev/null)

    for dir in $target_dirs
        if not test -d "$dir/chrome"
            mkdir -p "$dir/chrome"
        end

        ln -sf $CACHY_BROWSER_CSS "$dir/chrome"
    end
end
