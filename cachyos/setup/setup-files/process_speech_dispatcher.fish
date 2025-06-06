#!/usr/bin/env fish

source (dirname (status filename))/process.fish

process false link (./get_working_dir.fish)/speech-dispatcher $HOME/.config/speech-dispatcher
