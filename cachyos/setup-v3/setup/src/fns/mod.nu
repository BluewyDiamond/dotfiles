use ../extractors/index.nu *

export def collect-config-file-abs-path-list [config_file_abs_path: path]: nothing -> list<path> {
   mut config_file_abs_path_to_process_list = [$config_file_abs_path]
   mut config_file_abs_path_collected_list = []

   while ($config_file_abs_path_to_process_list | is-not-empty) {
      let config_file_abs_path_to_process = $config_file_abs_path_to_process_list | first
      $config_file_abs_path_to_process_list = $config_file_abs_path_to_process_list | skip 1

      $config_file_abs_path_collected_list = (
         $config_file_abs_path_collected_list | append $config_file_abs_path_to_process
      )

      let config_file_rel_path_list = open $config_file_abs_path_to_process | get include
      let config_file_dir_path_to_process = $config_file_abs_path_to_process | path dirname

      let config_file_abs_path_found_list = $config_file_rel_path_list
      | each {|config_file_rel_path|
         $config_file_dir_path_to_process
         | path join $config_file_rel_path
         | path expand
      }

      $config_file_abs_path_collected_list = (
         $config_file_abs_path_collected_list | append $config_file_abs_path_found_list
      )
   }

   $config_file_abs_path_collected_list
}

export def build-config [
   config_file_rel_path: path
]: nothing -> record<package_list: list<record<from: string, name: string, ignore: bool>>, file_spawn_list: list<record<owner: string, target_file_abs_path: path, content: string>>, item_install_list: list<record<operation: string, owner: string, source_item_abs_path: path, target_item_abs_path: path>>, unit_group_list: list<record<user: string, dir_abs_path: string, enable_list: list<string>>>> {
   let config_file_abs_path_list = collect-config-file-abs-path-list $config_file_rel_path
   $config_file_abs_path_list | print
   return

   let config_raw_group_list = $config_file_abs_path_list | each {|config_file_abs_path|
      {
         config_file_rel_path: $config_file_abs_path
         config_raw: (open $config_file_abs_path)
      }
   }

   let file_spawn_list = $config_raw_group_list.config_raw | each {|config_raw|
      $config_raw
      | get -o spawn-files
      | default []
      | each {|spawn_file|
         {
            owner: ($spawn_file | get owner)
            target_file_abs_path: ($spawn_file | get target)
            content: ($spawn_file | get content)
         }
      }
   } | flatten | uniq

   let item_install_list = $config_raw_group_list | each {|config_raw_group|
      let config_dir_rel_path = $config_raw_group.config_file_rel_path | path dirname

      $config_raw_group.config_raw
      | get -o install-items
      | default []
      | each {|install_item|
         {
            operation: ($install_item | get operation)
            owner: ($install_item | get owner)

            source_item_abs_path: (
               $config_dir_rel_path
               | path join ($install_item | get source)
               | path expand
            )

            target_item_abs_path: ($install_item | get target)
         }
      }
   } | flatten | uniq

   let package_list = $config_raw_group_list.config_raw | each {|config_raw|
      $config_raw | get -o packages | default []
   } | flatten | uniq

   let package_duplicate_list = $package_list.name | uniq -d

   if ($package_duplicate_list | is-not-empty) {
      error make {
         msg: "Duplicate package name is not allowed."
         help: $"The following package(s) are duplicated: ($package_duplicate_list | str join ', ')"
      }
   }

   let unit_group_list = $config_raw_group_list.config_raw | each {|config_raw|
      $config_raw
      | get -o services
      | default []
      | each {|service|
         {
            user: ($service | get user)
            dir_abs_path: ($service | get path)
            enable_list: ($service | get enable)
         }
      }
   }
   | flatten
   | group-by {|row|
      $"($row.user):($row.dir_abs_path)"
   }
   | values
   | each {|group|
      {
         user: $group.0.user
         dir_abs_path: $group.0.dir_abs_path
         enable_list: ($group | get enable_list | flatten | uniq)
      }
   }

   {
      file_spawn_list: $file_spawn_list
      item_install_list: $item_install_list
      package_list: $package_list
      unit_group_list: $unit_group_list
   }
}
