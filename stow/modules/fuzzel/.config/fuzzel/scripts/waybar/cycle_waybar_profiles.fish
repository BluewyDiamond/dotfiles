#!/usr/bin/env fish

set script_name (basename (status -f))
set script_name_no_ext (string split -r -m1 . $script_name)[1]

set profiles_dir $HOME/.config/waybar/profiles

set config_link $HOME/.config/waybar/config
set style_link $HOME/.config/waybar/style.css

set index_file $HOME/.cache/$script_name_no_ext

set profiles (command ls -d $profiles_dir/* | sort)

set num_profiles (count $profiles)

if test -f $index_file
    set current_index (cat $index_file)
else
    set current_index 0
end

set next_index (math (math $current_index + 1) % $num_profiles)

set next_profile $profiles[(math $next_index + 1)]

ln -sf $next_profile/config.jsonc $config_link
ln -sf $next_profile/style.css $style_link

echo $next_index > $index_file

echo "Switched to profile: $next_profile"
