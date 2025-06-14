#!/usr/bin/env fish

source (dirname (status filename))/process.fish

set working_dir_path (./get_working_dir.fish)

for file_path in $working_dir_path/libinput/*
    process true copy $file_path /etc/libinput/(basename $file_path)
end
