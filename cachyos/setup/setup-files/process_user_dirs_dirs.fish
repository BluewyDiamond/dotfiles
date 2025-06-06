#!/usr/bin/env fish

source (dirname (status filename))/process.fish

process false link (./get_working_dir.fish)/user-dirs.dirs $HOME/.config/user-dirs.dirs
