#!/usr/bin/env fish

source (dirname (status filename))/process.fish

process false link (./get_working_dir.fish)/electron-flags.conf $HOME/.config/electron-flags.conf
