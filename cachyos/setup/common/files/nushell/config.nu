# [Env]
#
$env.config.show_banner = false


# [Autostart]
#
# starship
mkdir ($nu.data-dir | path join "vendor/autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor/autoload/starship.nu")

# [[Visuals]]
tput cup (term size | get rows)
fastfetch -c ($env.HOME)/.config/fastfetch/wezterm.jsonc
