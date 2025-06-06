#!/usr/bin/env fish

source (dirname (status filename))/process.fish

for file in (./get_working_dir.fish)/bin/*
    process false link $file $HOME/.local/bin/(basename $file)
end
