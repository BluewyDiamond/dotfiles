# [ Helper Functions ]
#
# def build-args [flags: list<record<flag: string, value: any>>] {
#    print $"($flags)"
#    $flags
#    | where {|record|
#       $record.value != null and (
#          ($record.value | describe) != "bool" or
#          $record.value == true
#       )
#    }
#    | each {|record|
#       if ($record.value | describe) == "bool" {
#          $record.flag
#       } else {
#          $"($record.flag)=($record.value)"
#       }
#    }
# }

# [ Env ]
#
$env.config.show_banner = false

# [[ Path ]]
#
let path_list = [
   ($env.HOME | path join ".cargo" "bin")
   ($env.HOME | path join ".local" "bin")
]

$env.PATH = ($env.PATH | append $path_list)

# [[ XDG ]]
#
$env.XDG_CONFIG_HOME = ($env.HOME | path join ".config")
$env.XDG_DATA_HOME = ($env.HOME | path join ".local" "share")
$env.XDG_STATE_HOME = ($env.HOME | path join ".local" "state")
$env.XDG_CACHE_HOME = ($env.HOME | path join ".cache")

# [[ xdg-ninja ]]
#
$env.GOPATH = ($env.XDG_DATA_HOME | path join "go")
$env.GTK2_RC_FILES = ($env.XDG_CONFIG_HOME | path join "gtk-2.0" "gtkrc")
$env.NODE_REPL_HISTORY = ($env.XDG_STATE_HOME | path join "node_repl_history")
$env.NPM_CONFIG_INIT_MODULE = ($env.XDG_CONFIG_HOME | path join "npm" "config" "npm-init.js")
$env.NPM_CONFIG_CACHE = ($env.XDG_CACHE_HOME | path join "npm")
$env.NPM_CONFIG_TMP = ($env.XDG_RUNTIME_DIR | path join "npm")
$env.RUSTUP_HOME = ($env.XDG_DATA_HOME | path join "rustup")
$env.WINEPREFIX = ($env.XDG_DATA_HOME | path join "wine")

# [[ Other ]]
#
$env.EDITOR = "nvim"

# [ Alias ]
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

def --wrapped aura [...args] {
   let cmd = $args | reduce --fold ["paru"] {|arg acc|
      if not ($arg =~ "^-[a-zA-Z]+$") {
         $acc | append $arg
         return
      }

      $arg | split chars | skip 1 | reduce --fold $acc {|char flag|
         $flag | append (
            match $char {
               "S" => ["-S" "--repo"]
               "A" => ["-S" "--aur"]
               "W" => ["-S"]
               _ => [$"-($char)"]
            }
         )
      }
   }

   run-external ...$cmd
}

# [ Autostart ]
#
# for autoloading scripts
let nu_autoload = ($nu.data-dir | path join "vendor/autoload")

if not ($nu_autoload | path exists) {
   mkdir $nu_autoload
}

# [[ Prompt (Starship) ]]
#
do {||
   if (which starship | is-empty) {
      return
   }

   let starship_init_file_abs_path = ($nu_autoload | path join "starship.nu")
   let starship_init_file = starship init nu

   if (
      ($starship_init_file_abs_path | path exists) and
      ($starship_init_file == (open --raw $starship_init_file_abs_path))
   ) {
      return
   }

   $starship_init_file | save -f $starship_init_file_abs_path
}

# [[ Visuals ]]
#
# wait for window animations (usually lasts around 0.15sec)
# + consider the time it takes to reach here
sleep 0.15sec
tput cup (term size | get rows)
fastfetch -c ($env.HOME | path join ".config" "fastfetch" "wezterm.jsonc")
