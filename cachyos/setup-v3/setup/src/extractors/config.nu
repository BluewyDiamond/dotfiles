use ../utils *

export def extract-config [
   config_file_rel_path: string
]: nothing -> record<package: record<ignore_list: list<string>, std_list: list<string>, aur_list: list<string>, local_dir_abs_path_list: list<path>>, file_spawn_list: list<record<owner: string, target_item_abs_path: path, content: string>>, item_install_list: list<record<operation: string, owner: string, source_item_abs_path: path, target_item_abs_path: path>>, service_list: list<record<user: string, path: string, enable_list: list<string>>>> {
   let config_raw = open $config_file_rel_path

   let package = {
      ignore_list: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "ignore" }) {
               return []
            }

            $record_or_table.ignore
         }
      )

      std_list: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "std" }) {
               return []
            }

            $record_or_table.std
         }
      )

      aur_list: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "aur" }) {
               return []
            }

            $record_or_table.aur
         }
      )

      local_dir_abs_path_list: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "local" }) {
               return []
            }

            $record_or_table.local
         }
         | each {|local_package_dir_rel_path|
            $config_file_rel_path
            | path dirname
            | path join $local_package_dir_rel_path
            | path expand
         }
      )
   }

   {
      package: $package

      file_spawn_list: (
         $config_raw
         | get -o spawn_files
         | default []
         | each {|spawn_file|
            {
               owner: ($spawn_file | get owner)
               target_item_abs_path: ($spawn_file | get target)
               content: ($spawn_file | get content)
            }
         }
      )

      item_install_list: (
         $config_raw
         | get -o install_files
         | default []
         | each {|install_file|
            let source_item_abs_path = $config_file_rel_path
            | path dirname
            | path join ($install_file | get source)
            | path expand

            {
               operation: ($install_file | get operation)
               owner: ($install_file | get owner)

               source_item_abs_path: (
                  $config_file_rel_path
                  | path dirname
                  | path join ($install_file | get source)
                  | path expand
               )

               target_item_abs_path: ($install_file | get target)
            }
         }
      )

      service_list: (
         $config_raw
         | get -o services
         | default []
         | each {|service|
            {
               user: ($service | get user)
               enable_list: ($service | get enable)
               path: ($service | get path)
            }
         }
      )
   }
}
