use ../extractors/index.nu *

export def collect-index-file-abs-path-list [index_file_rel_path: path]: nothing -> list<path> {
   mut index_file_abs_path_list_to_process = [($index_file_rel_path | path expand)]
   mut index_file_abs_path_list_collected = []

   while ($index_file_abs_path_list_to_process | is-not-empty) {
      let index_file_abs_path_to_process = $index_file_abs_path_list_to_process | first
      $index_file_abs_path_list_to_process = $index_file_abs_path_list_to_process | skip 1
      $index_file_abs_path_list_collected = $index_file_abs_path_list_collected | append $index_file_abs_path_to_process
      let index_file_rel_path_list = extract-index-rel-path-list $index_file_abs_path_to_process

      let index_file_abs_path_list_found = (
         $index_file_rel_path_list
         | where {|index_file_rel_path|
            $"($index_file_rel_path | path basename)" == "index.toml"
         }
         | each {|index_file_rel_path|
            $index_file_abs_path_to_process
            | path dirname
            | path join $index_file_rel_path
            | path expand # in this scenario the path is correctly formed and path expand is used to prettify it
            # example: /users/user1/../user2 -> /users/user2
         }
      )

      $index_file_abs_path_list_collected = $index_file_abs_path_list_collected | append $index_file_abs_path_list_found
   }

   $index_file_abs_path_list_collected
}

export def collect-config-file-abs-path-list [index_file_abs_path: list<path>]: nothing -> list<path> {
   $index_file_abs_path
   | each {|index_file_abs_path|
      extract-index-rel-path-list $index_file_abs_path
      | where {|index_file_rel_path|
         $"($index_file_rel_path | path basename)" != "index.toml"
      } | each {|index_file_rel_path|
         $index_file_abs_path
         | path dirname
         | path join $index_file_rel_path
         | path expand
      }
   } | flatten
}

export def merge-config-list [
   config_list: any
] {
   # not using get -o because it should be garanteed
   # as long as we passing the value of the getter
   # futhermore if typing was not lost we could have accessed the values directly
   {
      package: {
         ignore_list: ($config_list | get package.ignore_list | flatten | uniq)
         std_list: ($config_list | get package.std_list | flatten | uniq)
         aur_list: ($config_list | get package.aur_list | flatten | uniq)
         local_abs_path_list: ($config_list | get package.local_dir_abs_path_list | flatten | uniq)
      }

      file_spawn_list: ($config_list | get file_spawn_list | flatten)
      item_install_list: ($config_list | get item_install_list | flatten)

      service_list: ($config_list | get service_list | flatten | uniq)
   }
}
