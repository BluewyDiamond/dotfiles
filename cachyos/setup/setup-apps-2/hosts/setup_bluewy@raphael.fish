set script_dir (realpath (dirname (status filename)))
set packages_filepath $script_dir/../common/packages.json

set std_packages
set aur_packages

# script dependencies
set -a std_packages paru

# the thing
set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/system.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/system.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/system_extra.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/system_extra.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/system_rusty.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/system_rusty.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/tty_session.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/tty_session.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/tty_extra.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/tty_extra.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/tty_rice.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/tty_rice.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/hyprland_session.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/hyprland_session.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/hyprland_extra.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/hyprland_extra.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/hyprland_rice.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/hyprland_rice.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/hyprland_widgets.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/hyprland_widgets.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps_neovim.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps_neovim.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps_discord.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps_discord.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps_dolphin.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps_dolphin.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps_gaming.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps_gaming.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps_production.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps_production.json)

set -a std_packages (jq -r '.std // [] | .[]' $script_dir/../common/packages/apps_virtualization.json)
set -a aur_packages (jq -r '.aur // [] | .[]' $script_dir/../common/packages/apps_virtualization.json)

# hardware
set -a std_packages amd-ucode lact

### testing
echo "STD PACKAGES"
for i in $std_packages
    echo "item: $i"
end

echo "AUR PACKAGES"
for i in $aur_packages
    echo "item: $i"
end

function install
    sudo pacman -S --needed $std_packages paru && paru -S --aur $aur_packages
end

function cleanup
end
