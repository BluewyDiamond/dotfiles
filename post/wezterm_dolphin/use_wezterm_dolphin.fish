#!/bin/env fish

mkdir -p $HOME/.local/share/kio/servicemenus
cp open-in-wezterm.desktop $HOME/.local/share/kio/servicemenus

echo "script: add TerminalApplication=wezterm to ~/.config/kdeglobals"
