#!/usr/bin/env fish

source ./process.fish

set working_dir (./get_working_dir.fish)
process false link (./get_working_dir.fish)/librewolf/librewolf.overrides.cfg $HOME/.librewolf/librewolf.overrides.cfg

for profile_dir in (find "$HOME/.librewolf" -type d -name '*default-default' 2>/dev/null)
    set chrome_dir $profile_dir/chrome

    if not test -e $chrome_dir
        mkdir -p $chrome_dir
    end

    if not test -d
        trash $chrome_dir
        mkdir -p $chrome_dir
    end

    process false link $working_dir/librewolf/userChrome.css $chrome_dir/userChrome.css
end
