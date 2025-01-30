#!/usr/bin/env fish

for file in $PWD/modules/*
    ./manage_module.fish $file
end
