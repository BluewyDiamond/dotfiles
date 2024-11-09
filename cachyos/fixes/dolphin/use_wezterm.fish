#!/bin/env fish

set -g SCRIPT_NAME (basename (status -f))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

# add custom entry to open the proper path in wezterm
mkdir -p $HOME/.local/share/kio/servicemenus
cp open-in-wezterm.desktop $HOME/.local/share/kio/servicemenus

# open terminal application with preferred terminal
prompt "Add 'TerminalApplication=wezterm' under '[General]' in ~/.config/kdeglobals."
