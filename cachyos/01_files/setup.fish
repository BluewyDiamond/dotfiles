#!/usr/bin/env fish

# global
#
set script_name (path basename (status filename))

# utils
#
function print
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

# other
#
function process
    set super $argv[1]

    if not contains "$super" true false
        print "ERROR: super must be either 'true' or 'false'."
        return 1
    end

    set operation $argv[2]

    if not contains "$operation" copy link
        print "ERROR: operation must be either 'copy' or 'link'."
        return 1
    end

    set source $argv[3]

    if not test -e "$source"
        print "ERROR: source '$source' is not a valid file."
        return 1
    end

    set target $argv[4]

    # TODO: Rather than checking if target_dir exists and then immediatly
    # do stuff, store in a variable the state and then based of it do it.
    # Maybe this way it is more readable.

    print "TASK: $operation $source to $target, super is $super."

    if test true = $super
        set sudo_command sudo
    end

    set target_dirname (dirname $target)

    if not test -d $target_dirname
        if not test -e $target_dirname
            set -l for_lsp print "INFO: target_dirname=$target_dirname does not exist, it will be created."
            set -a prepare_commands_as_strings "$for_lsp"
            set -a prepare_commands_as_strings "$sudo_command mkdir -p $target_dirname"
        else
            set -l for_lsp print "INFO: target_dirname=$target_dirname is not a folder, it will be trashed and recreated."
            set -a prepare_commands_as_strings "$for_lsp"
            set -a prepare_commands_as_strings "$sudo_command trash $target_dirname"
            set -a prepare_commands_as_strings "$sudo_command mkdir -p $target_dirname"
        end
    end

    if test -e "$target" -o -L "$target"
        set -l for_lsp print "WARNING: target=$target already exists, it will be trashed."
        set -a prepare_commands_as_strings "$for_lsp"
        set -a prepare_commands_as_strings "$sudo_command trash $target"
    end

    if test copy = $operation
        set -a action_command cp
    else
        set -a action_command ln -s
    end

    set execute_command $sudo_command $action_command $source $target

    # calculated commands to run
    #
    for command_as_string in $prepare_commands_as_strings
        set cmd (string split ' ' (string trim $command_as_string))
        $cmd
    end

    $execute_command
end

# main
#
if not which trash &>/dev/null
    print "ERROR: trash-cli is required."
    exit 1
end

set current_dir (dirname (realpath (status --current-filename)))

process false link $current_dir/modules/MangoHud $HOME/.config/MangoHud
process false link $current_dir/modules/ags $HOME/.config/ags

for file in $current_dir/modules/applications/*
    process false link $file $HOME/.local/share/applications/(basename $file)
end

for file in $current_dir/modules/bin/*
    process false link $file $HOME/.local/bin/(basename $file)
end

process false link $current_dir/modules/cachy/cachy.overrides.cfg $HOME/.cachy/cachy.overrides.cfg

for profile_dir in (find "$HOME/.cachy" -type d -name '*default-release' 2>/dev/null)
    set chrome_dir $profile_dir/chrome

    if not test -e $chrome_dir
        mkdir -p $chrome_dir
    end

    if not test -d
        trash $chrome_dir
        mkdir -p $chrome_dir
    end

    process false link $current_dir/modules/cachy/userChrome.css $chrome_dir/userChrome.css
end

process false link $current_dir/modules/css $HOME/.config/css
process false link $current_dir/modules/fastfetch $HOME/.config/fastfetch

process false link $current_dir/modules/fish_bluewy $HOME/.config/fish_bluewy
echo "source $HOME/.config/fish_bluewy/config.fish" >$HOME/.config/fish/conf.d/init_bluewy.fish

process false link $current_dir/modules/fuzzel $HOME/.config/fuzzel
process false link $current_dir/modules/hypr $HOME/.config/hypr

for file in $current_dir/modules/kbd/*
    process true copy $file /usr/share/kbd/keymaps/(basename $file)
end

process false link $current_dir/modules/nvim $HOME/.config/nvim
process false link $current_dir/modules/pipewire $HOME/.config/pipewire
process false link $current_dir/modules/speech-dispatcher $HOME/.config/speech-dispatcher
process false link $current_dir/modules/wayland-pipewire-idle-inhibit $HOME/.config/wayland-pipewire-idle-inhibit
process false link $current_dir/modules/wezterm $HOME/.config/wezterm
process false link $current_dir/modules/xkb $HOME/.config/xkb

for file in $current_dir/modules/xkb/symbols/*
    process true copy $file /usr/share/X11/xkb/symbols/(basename $file)
end

process false link $current_dir/modules/electron-flags.conf $HOME/.config/electron-flags.conf
process false link $current_dir/modules/user-dirs.dirs $HOME/.config/user-dirs.dirs

process true copy $current_dir/modules/systemd_services/screen_off.service /etc/systemd/system/screen_off.service; and systemctl enable screen_off.service
process true copy $current_dir/modules/systemd_services/screen_off.fish /usr/local/bin/screen_off.fish
