# [Env]
#
$env.config.show_banner = false

# [[Paths]]
#
let path_list = [
   ($env.HOME | path join ".cargo" "bin")
   ($env.HOME | path join ".local" "bin")
]

$env.PATH = ($env.PATH | append $path_list)

# [[XDG]]
#
$env.XDG_CONFIG_HOME = ($env.HOME | path join ".config")
$env.XDG_DATA_HOME = ($env.HOME | path join ".local" "share")
$env.XDG_STATE_HOME = ($env.HOME | path join ".local" "state")
$env.XDG_CACHE_HOME = ($env.HOME | path join ".cache")

# [[Other]]
#
$env.EDITOR = "nvim"

# [Helper Functions]
#
def build-args [flags: list<record<flag: string, value: any>>] {
   print $"($flags)"
   $flags
   | where {|record|
      $record.value != null and (
         ($record.value | describe) != "bool" or
         $record.value == true
      )
   }
   | each {|record|
      if ($record.value | describe) == "bool" {
         $record.flag
      } else {
         $"($record.flag)=($record.value)"
      }
   }
}

# [Aliases]
#
# replacing built-in commands kinda broken rn
# while technically working,
# the alias --help is calling the replacer --help
# this only happens when replacing built-in commands
alias nu-clear = clear

# https://www.nushell.sh/commands/docs/clear.html
def clear [
   --keep-scrollback (-k)
] {
   nu-clear --keep-scrollback=$keep_scrollback
   tput cup (term size | get rows)
}

# [Autostart]
#
# starship
mkdir ($nu.data-dir | path join "vendor" "autoload")
starship init nu | save -f ($nu.data-dir | path join "vendor" "autoload" "starship.nu")

# [[Visuals]]
tput cup (term size | get rows)
fastfetch -c ($env.HOME | path join ".config" "fastfetch" "wezterm.jsonc")
