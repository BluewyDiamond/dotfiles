#!/usr/bin/env fish

source ./process.fish

for file in (./get_working_dir.fish)/xkb/symbols/*
    process true copy $file /usr/share/X11/xkb/symbols/(basename $file)
end
