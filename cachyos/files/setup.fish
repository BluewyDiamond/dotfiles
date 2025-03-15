#!/usr/bin/env fish

# global
set script_name (path basename (status filename))

# utils
function message
    set script_name (path basename (status filename))

    set_color magenta
    echo -n "$script_name => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function scan
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

# main
if not which trash &>/dev/null
    message "ERROR: trash-cli is required."
    exit 1
end

function manage
    if test (count $argv) -lt 3
        message "ERROR: source, target, and operation must be provided."
        return 1
    end

    set source $argv[1]
    set target $argv[2]
    set operation $argv[3]
    set super $argv[4]

    if not test -e "$source"
        message "ERROR: source '$source' is not a valid file."
        return 1
    end

    if not contains "$operation" copy link
        message "ERROR: operation must be either 'copy' or 'link'."
        return 1
    end

    if test -z "$super"
        set super false
    end

    if not contains "$super" true false
        message "ERROR: super must be either 'true' or 'false'."
        return 1
    end

    message "TASK: $operation $source to $target, super is $super."

    set do_it (test "true" = $super; and echo sudo)

    if not test -d (dirname $target)
        if test -e (dirname $target)
            message "INFO: (dirname $target) is not a folder, it will be trashed and recreated."
            set -l -a wee $do_it trash (dirname $target)
            $wee
            set -l -a lol $do_it mkdir -p (dirname $target)
            $lol
        else
            message "INFO: (dirname $target) doesn't exist, it will be created."
        end
    else
        set -l -a wee $do_it mkdir -p (dirname $target)
    end

    if test -e "$target" -o -L "$target"
        message "WARNING: $target already exists, it will be trashed."
        set -l -a wee $do_it trash $target
        $wee
    end

    if test copy = $operation
        set -a do_it cp
    else
        set -a do_it ln -s
    end

    $do_it $source $target
end

set current_dir (dirname (realpath (status --current-filename)))

manage $current_dir/modules/MangoHud $HOME/.config/MangoHud link
manage $current_dir/modules/ags $HOME/.config/ags link

for file in $current_dir/modules/applications/*
    manage $file $HOME/.local/share/applications/(basename $file) link
end

for file in $current_dir/modules/bin/*
    manage $file $HOME/.local/bin/(basename $file) link
end

manage $current_dir/modules/cachy/cachy.overrides.cfg $HOME/.cachy/cachy.overrides.cfg link

set profile_dirs (find "$HOME/.cachy" -type d -name '*default-release' 2>/dev/null)
for dir in $profile_dirs
    set chrome_dir $dir/chrome

    if not test -e $chrome_dir
        mkdir -p $chrome_dir
    end

    manage $current_dir/modules/cachy/userChrome.css $chrome_dir/userChrome.css link
end

manage $current_dir/modules/css $HOME/.config/css link
manage $current_dir/modules/fastfetch $HOME/.config/fastfetch link
manage $current_dir/modules/fish_bluewy $HOME/.config/fish_bluewy link
manage $current_dir/modules/fuzzel $HOME/.config/fuzzel link
manage $current_dir/modules/hypr $HOME/.config/hypr link

for file in $current_dir/modules/kbd/*
    manage $file /usr/share/kbd/keymaps/(basename $file) copy true
end

manage $current_dir/modules/nvim $HOME/.config/nvim link
manage $current_dir/modules/pipewire $HOME/.config/pipewire link
manage $current_dir/modules/speech-dispatcher $HOME/.config/speech-dispatcher link
manage $current_dir/modules/wayland-pipewire-idle-inhibit $HOME/.config/wayland-pipewire-idle-inhibit link
manage $current_dir/modules/wezterm $HOME/.config/wezterm link
manage $current_dir/modules/xkb $HOME/.config/xkb link

for file in $current_dir/modules/xkb/symbols/*
    manage $file /usr/share/X11/xkb/symbols/(basename $file) copy true
end

manage $current_dir/modules/electron-flags.conf $HOME/.config/electron-flags.conf link
manage $current_dir/modules/user-dirs.dirs $HOME/.config/user-dirs.dirs link
