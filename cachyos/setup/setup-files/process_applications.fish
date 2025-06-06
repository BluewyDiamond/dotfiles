#!/usr/bin/env fish

source (dirname (status filename))/process.fish

for file in (./get_working_dir.fish)/applications/*
    process false link $file $HOME/.local/share/applications/(basename $file)
end
