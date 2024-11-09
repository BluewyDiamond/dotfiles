#!/usr/bin/env fish

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
	ln -sf $PWD/manual_files/fish-bluewy $HOME/.config/fish-bluewy

	if test -d $HOME/.config/fish -o -f $HOME/.config/fish -o -L $HOME/.config/fish
		trash $HOME/.config/fish
	end

    mkdir $HOME/.config/fish
    mkdir $HOME/.config/fish/conf.d
    mkdir $HOME/.config/fish/functions
    mkdir $HOME/.config/fish/themes

    echo "source $HOME/.config/fish-bluewy/config.fish" >> $HOME/.config/fish/conf.d/init_bluewy.fish
end

# cachy_browser
fish_shell
