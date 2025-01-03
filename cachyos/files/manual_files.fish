#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))

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
    set CACHY_BROWSER_OVERRIDES (realpath (dirname (status filename)))/files_for_manual/cachy-browser/cachy.overrides.cfg
    set CACHY_BROWSER_CSS (realpath (dirname (status filename)))/files_for_manual/cachy-browser/userChrome.css

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
    set s_file (realpath (dirname (status filename)))/files_for_manual/fish-bluewy
    set target $HOME/.config/fish-bluewy
    set fish_dir $HOME/.config/fish

    if test -f $target -o -d $target -o -L $target
        prompt "The following already exists, trash it? [y/N] | $target"
        set choice (input N)

        if not string match -i -q -- Y $choice
            prompt "Skipping..."
            return
        end

        trash $target
    end

    ln -s $s_file $target

    if test -d $fish_dir -o -f $fish_dir -o -L $fish_dir
        prompt "The following already exists, trash it? [y/N] | $fish_dir"
        set choice (input N)

        if not string match -i -q -- Y $choice
            prompt "Skipping..."
            return
        end

        trash $fish_dir
    end

    mkdir $fish_dir
    mkdir $fish_dir/conf.d
    mkdir $fish_dir/functions
    mkdir $fish_dir/themes

    ln -s $target/themes/one_dark_gogh.theme $fish_dir/themes
    echo "source $target/config.fish" >>$fish_dir/conf.d/init_bluewy.fish
end

prompt "1. Cachy Browser Stuff"
prompt "2. Fish Shell"
prompt "3. All the Above"

set choice (input)

switch $choice
    case 1
        cachy_browser
    case 2
        fish_shell
    case 3
        cachy_browser
        fish_shell
    case '*'
        prompt "Not a valid choice..."
end
