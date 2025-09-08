export def spawn-file-list [config] {
   $config.file_spawn_list | each {|file_spawn|
      try {
         if $file_spawn.owner != $env.LOGNAME {
            log info $"checking file to spawn as user=($file_spawn.owner) with target=($file_spawn.target_file_abs_path)"
            $file_spawn | to nuon | sudo -u $file_spawn.owner -- ./../deps/spawn-file.nu
         } else {
            log info $"checking file to spawn with target=($file_spawn.target_file_abs_path)"
            $file_spawn | to nuon | ./../deps/spawn-file.nu
         }
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}

export def install-item-list [config] {
   $config.item_install_list | each {|item_install|
      try {
         if $item_install.owner != $env.LOGNAME {
            log info $"checking file to install as user=($item_install.owner) with target=($item_install.target_item_abs_path)"
            $item_install | to nuon | sudo -u $item_install.owner -- ./../deps/install-item.nu
         } else {
            log info $"checking file to install with target=($item_install.target_item_abs_path)"
            $item_install | to nuon | ./../deps/install-item.nu
         }
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}
