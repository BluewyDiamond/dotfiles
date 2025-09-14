export def spawn-file-list [config] {
   $config.file_spawn_list | each {|file_spawn|
      try {
         log info (
            $"checking file to spawn as user=($file_spawn.owner)" +
            $" with target=($file_spawn.target_file_abs_path)"
         )

         let target_item_abs_path_existing_type_or_null = (
            $file_spawn.target_file_abs_path | path type
         )

         match $target_item_abs_path_existing_type_or_null {
            dir => {
               log info $"spawning file at target=($file_spawn.target_file_abs_path)"
               rm -r $file_spawn.target_file_abs_path
               $file_spawn.content | save $file_spawn.target_file_abs_path
            }

            file => {
               let target_file = open --raw $file_spawn.target_file_abs_path

               if ($target_file == $file_spawn.content) {
                  log info (
                     $"skipping as target=($file_spawn.target_file_abs_path) matches with content"
                  )

                  return
               }

               log info $"spawning file at target=($file_spawn.target_file_abs_path)"
               rm $file_spawn.target_file_abs_path
               $file_spawn.content | save $file_spawn.target_file_abs_path
            }

            symlink => {
               log info $"spawning file at target=($file_spawn.target_file_abs_path)"
               unlink $file_spawn.target_file_abs_path
               $file_spawn.content | save $file_spawn.target_file_abs_path
            }

            null => {
               let target_parent_dir_abs_path = (
                  $file_spawn.target_file_abs_path | path dirname
               )

               if not ($target_parent_dir_abs_path | path exists) {
                  mkdir $target_parent_dir_abs_path
               }

               log info $"spawning file at target=($file_spawn.target_file_abs_path)"
               $file_spawn.content | save $file_spawn.target_file_abs_path
            }

            _ => {
               error make {msg: 'Not all patterns has been exhausted'}
            }
         }

         apply-ownership $file_spawn.owner $file_spawn.target_file_abs_path
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}

export def install-item-list [config] {
   $config.item_install_list | each {|item_install|
      try {
         operate-item-install $item_install
      } catch {|error|
         $error.rendered | print
      }
   } | ignore
}

def operate-item-install [item_install] {
   log info (
      $"checking file to install as user=($item_install.owner)" +
      $" with target=($item_install.target_item_abs_path)"
   )

   let source_item_abs_path_existing_type_or_null = $item_install.source_item_abs_path | path type
   let target_item_abs_path_existing_type_or_null = $item_install.target_item_abs_path | path type

   # wrapping it in a closure allows for early returns
   # as now it needs to check the correct ownership at the end
   do {||
      match [
         $item_install.operation
         $source_item_abs_path_existing_type_or_null
         $target_item_abs_path_existing_type_or_null
      ] {
         # needs to be at the top so it allows me to use '_' more freely
         # this is because later on '_' will match everything except the conditions
         # already defined
         [_ null _] => {
            log error $"skipping source=($item_install.source_item_abs_path) does not exist"
         }

         # separator
         #
         [copy _ null] => {
            let target_parent_dir_abs_path = $item_install.target_item_abs_path | path dirname

            if not ($target_parent_dir_abs_path | path exists) {
               mkdir $target_parent_dir_abs_path
            }

            log info $"installing to target=($item_install.target_item_abs_path)"
            cp -r $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [copy dir dir] => {
            if (
               diff -rq $item_install.target_item_abs_path $item_install.source_item_abs_path
            ) {
               log info (
                  $"skipping as target=($item_install.target_item_abs_path) matches with source"
               )

               return
            }

            log info $"installing to target=($item_install.target_item_abs_path)"
            rm -r $item_install.target_item_abs_path
            cp -r $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [copy file file] => {
            let target_file = open --raw $item_install.target_item_abs_path
            let source_file = open --raw $item_install.source_item_abs_path

            if ($target_file == $source_file) {
               log info (
                  $"skipping as target=($item_install.target_item_abs_path) matches with source"
               )

               return
            }

            log info $"installing to target=($item_install.target_item_abs_path)"
            rm $item_install.target_item_abs_path
            cp $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [copy symlink symlink] => {
            if (
               ($item_install.source_item_abs_path | path expand) ==
               ($item_install.target_item_abs_path | path expand)
            ) {
               log info (
                  $"skipping as target=($item_install.target_item_abs_path) matches with source"
               )

               return
            }

            log info $"installing to target=($item_install.target_item_abs_path)"
            unlink $item_install.target_item_abs_path
            cp $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [link _ null] => {
            let target_parent_dir_abs_path = $item_install.target_item_abs_path | path dirname

            if not ($target_parent_dir_abs_path | path exists) {
               mkdir $target_parent_dir_abs_path
            }

            log info $"installing to target=($item_install.target_item_abs_path)"
            ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [link _ dir] => {
            log info $"installing to target=($item_install.target_item_abs_path)"
            rm -r $item_install.target_item_abs_path
            ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [link _ file] => {
            log info $"installing to target=($item_install.target_item_abs_path)"
            rm $item_install.target_item_abs_path
            ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [link _ symlink] => {
            if (
               ($item_install.target_item_abs_path | path expand) ==
               $item_install.source_item_abs_path
            ) {
               log info (
                  $"skipping as target=($item_install.target_item_abs_path) matches with source"
               )

               return
            }

            log info $"installing to target=($item_install.target_item_abs_path)"
            unlink $item_install.target_item_abs_path
            ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
         }

         [_ _ _] => { error make {msg: 'Not all patterns has been exhausted'} }
      }
   }

   apply-ownership $item_install.owner $item_install.target_item_abs_path
}

def apply-ownership [owner: string target_item_abs_path: path] {
   if ($owner == $env.LOGNAME) {
      return
   }

   let i = ls -lD target_item_abs_path
   let u = $i | get 0 | get user

   if ($u == $owner) {
      return
   }

   chown -R $"($owner):($owner)" target_item_abs_path
}
