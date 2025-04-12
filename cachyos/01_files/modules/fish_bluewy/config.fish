set current_dir (dirname (realpath (status --current-filename)))

for file in (realpath $current_dir/conf.d/*.fish)
    source $file
end

for file in (realpath $current_dir/functions/*.fish)
    source $file
end
