#!/usr/bin/env fish

set SCRIPT_NAME (basename (status -f))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

function cachy_browser
    set CACHY_BROWSER_OVERRIDES $PWD/manual_files/cachy-browser/cachy.overrides.cfg
    set CACHY_BROWSER_CSS $PWD/manual_files/cachy-browser/userChrome.css

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

function fish_shell
    if test -f $HOME/.config/fish-bluewy -o -d $HOME/.config/fish-bluewy -o -L $HOME/.config/fish-bluewy
        trash $HOME/.config/fish-bluewy
    end

    ln -s $PWD/manual_files/fish-bluewy $HOME/.config/fish-bluewy

    if test -d $HOME/.config/fish -o -f $HOME/.config/fish -o -L $HOME/.config/fish
        trash $HOME/.config/fish
    end

    mkdir $HOME/.config/fish
    mkdir $HOME/.config/fish/conf.d
    mkdir $HOME/.config/fish/functions
    mkdir $HOME/.config/fish/themes

    ln -s $PWD/manual_files/fish-bluewy/themes/one_dark_gogh.theme $HOME/.config/fish/themes
    echo "source $HOME/.config/fish-bluewy/config.fish" >>$HOME/.config/fish/conf.d/init_bluewy.fish
end

# cachy_browser
# fish_shell
