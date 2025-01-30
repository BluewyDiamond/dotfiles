#!/usr/bin/env fish

for file in $PWD/files_for_link/*
    ./manage_module.fish $file
end
