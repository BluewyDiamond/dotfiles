#!/usr/bin/env fish

source ./process.fish

for file in (./get_working_dir.fish)/kbd/*
    process true copy $file /usr/share/kbd/keymaps/(basename $file)
end
