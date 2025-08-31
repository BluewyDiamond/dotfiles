export def spawn-file-list [config] {
   log info "start of spawn file list"

   $config.file_spawn_list | each {|file_spawn|
      try {
         if $file_spawn.owner != $env.LOGNAME {
            sudo -u $file_spawn.owner -- ./../deps/spawn-file.nu $"($file_spawn | to nuon)"
         } else {
            ./../deps/spawn-file.nu $"($file_spawn)"
         }
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}

export def install-file-list [config] {
   log info "start of install file list"

   $config.file_install_list | each {|file_install|
      try {
         if $file_install.owner != $env.LOGNAME {
            sudo -u $file_install.owner -- ./../deps/install-file.nu $"($file_install | to nuon)"
         } else {
            ./../deps/install-file.nu $"($file_install | to nuon)"
         }
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}
