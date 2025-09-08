export def spawn-file-list [config] {
   log info "start of spawn file list"

   $config.file_spawn_list | each {|file_spawn|
      try {
         if $file_spawn.owner != $env.LOGNAME {
            $file_spawn | sudo -u $file_spawn.owner -- ./../deps/spawn-file.nu
         } else {
            $file_spawn | ./../deps/spawn-file.nu
         }
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}

export def install-item-list [config] {
   log info "start of install file list"

   $config.item_install_list | each {|item_install|
      try {
         if $item_install.owner != $env.LOGNAME {
            $item_install | sudo -u $item_install.owner -- ./../deps/install-item.nu
         } else {
            $item_install | ./../deps/install-item.nu
         }
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}
