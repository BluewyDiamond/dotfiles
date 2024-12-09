#!/usr/bin/env fish

set SCRIPT_NAME (basename (status filename))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

function link_files # $PWD/link_files/config $HOME/.config
    set container $argv[1]
    set files (command ls $container)
    set target_container $argv[2]

    for file in $files
        if test -f $target_container/$file -o -d $target_container/$file -o -L $target_container/$file
            prompt "The following conflicts, $target_container/$file, trash it? [y/N]"
            set choice (input N)

            if not string match -q -i Y "$choice"
                prompt "Skipping..."
                continue
            end

            trash $target_container/$file
        end

        ln -s $container/$file $target_container/$file
    end
end

# main

sudo pacman -S --needed trash-cli

set container (realpath (dirname (status filename)))/link_files
set files (command ls $container)

for file in $files
    set target "$HOME/downloads"

    if string match -q -i config $file
        set target "$HOME/.config"
    else
        prompt "Skipping..."
        continue
    end

    link_files $container/$file $target
end
