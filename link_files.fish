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

sudo pacman -S --needed stow

pushd ./link/stow

for module in *
    stow $module -t $HOME
end

popd

# manual stuff

ln -sf $PWD/link/manual/librewolf/librewolf.overrides.cfg $HOME/.librewolf

set target_dirs (find $HOME/.librewolf -type d -name '*default-default' 2>/dev/null)

for dir in $target_dirs
    if not test -d "$dir/chrome"
        mdkir "$dir/chrome"
    end

    ln -sf $PWD/link/manual/librewolf/userChrome.css "$dir/chrome"
end
