for file in $HOME/.config/fish-bluewy/conf.d/*.fish
    source $file
end

for file in $HOME/.config/fish-bluewy/functions/*.fish
    source $file
end
