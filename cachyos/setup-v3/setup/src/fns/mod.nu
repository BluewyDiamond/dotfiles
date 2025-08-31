use ../extractors/index.nu *

export def collect-index-abs-pathname-list [index_rel_pathname: path]: nothing -> list<path> {
   mut index_abs_pathname_list_to_process = [($index_rel_pathname | path expand)]
   mut all_index_abs_pathname_list = []

   while ($index_abs_pathname_list_to_process | is-not-empty) {
      let current_index_abs_pathname_to_process = $index_abs_pathname_list_to_process | first
      $index_abs_pathname_list_to_process = $index_abs_pathname_list_to_process | skip 1
      $all_index_abs_pathname_list = $all_index_abs_pathname_list | append $current_index_abs_pathname_to_process
      let source_rel_pathname_list = extract-source-rel-pathname-list $current_index_abs_pathname_to_process

      let found_index_abs_pathname_list = (
         $source_rel_pathname_list
         | where {|source_rel_pathname| $"($source_rel_pathname | path basename)" == "index.toml" }
         | each {|source_rel_pathname|
            $current_index_abs_pathname_to_process
            | path dirname
            | path join $source_rel_pathname
            | path expand # in this scenario the path is correctly formed and path expand is used to prettify it
            # example: /users/user1/../user2 -> /users/user2
         }
      )

      $all_index_abs_pathname_list = $all_index_abs_pathname_list | append $found_index_abs_pathname_list
   }

   $all_index_abs_pathname_list
}

export def collect-config-abs-pathname-list [index_abs_pathname_list: list<path>]: nothing -> list<path> {
   $index_abs_pathname_list
   | each {|index_abs_pathname|
      extract-source-rel-pathname-list $index_abs_pathname
      | where {|source_rel_pathname|
         $"($source_rel_pathname | path basename)" != "index.toml"
      } | each {|source_rel_pathname|
         $index_abs_pathname
         | path dirname
         | path join $source_rel_pathname
         | path expand
      }
   } | flatten
}

export def merge-config-list [
   config_list: any
]: nothing -> record<package: record<ignore_list: list<string>, std_list: list<string>, aur_list: list<string>, local_abs_path_list: list<path>>, file_spawn_list: list<record<owner: string, target_abs_pathname: path, content: string>>, file_install_list: list<record<operation: string, owner: string, source_abs_pathname: path, target_abs_pathname: path>>, service_list: list<record<user: string, enable_list: list<string>>>> {
   # not using get -o because it should be garanteed
   # as long as we passing the value of the getter
   # futhermore if typing was not lost we could have accessed the values directly
   {
      package: {
         ignore_list: ($config_list | get package.ignore_list | flatten | uniq)
         std_list: ($config_list | get package.std_list | flatten | uniq)
         aur_list: ($config_list | get package.aur_list | flatten | uniq)
         local_abs_path_list: ($config_list | get package.local_abs_path_list | flatten | uniq)
      }

      file_spawn_list: ($config_list | get file_spawn_list | flatten)
      file_install_list: ($config_list | get file_install_list | flatten)

      service_list: ($config_list | get service_list | flatten | uniq)
   }
}
