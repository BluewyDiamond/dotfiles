#!/usr/bin/env fish

set -g SCRIPT_NAME (basename (status -f))
set -g KDE_GLOBALS $HOME/.config/kdeglobals

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
end

prompt "Add 'Theme=ICON_THEME_NAME' under '[ICONS]' in ~/.config/kdeglobals."
