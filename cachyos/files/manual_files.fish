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

cachy_browser
