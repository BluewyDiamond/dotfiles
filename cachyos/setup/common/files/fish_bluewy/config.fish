set script_path (dirname (realpath (status --current-filename)))

for file in (realpath $script_path/conf.d/*.fish)
    source $file
end

for file in (realpath $script_path/functions/*.fish)
    source $file
end
