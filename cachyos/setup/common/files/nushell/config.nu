# [Env]
#
$env.config.show_banner = false

$env.XDG_CONFIG_HOME = ($env.HOME | path join ".config")
$env.XDG_DATA_HOME = ($env.HOME | path join ".local" "share")
$env.XDG_STATE_HOME = ($env.HOME | path join ".local" "state")
$env.XDG_CACHE_HOME = ($env.HOME | path join ".cache")

# [Aliases]
#
def clear [] {
   ^clear
   tput cup (term size | get rows)
}

# [Autostart]
#
# starship
mkdir ($nu.data-dir | path join "vendor" "autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor" "autoload" "starship.nu")

# [[Visuals]]
tput cup (term size | get rows)
fastfetch -c ($env.HOME)/.config/fastfetch/wezterm.jsonc
