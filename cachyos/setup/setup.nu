#!/usr/bin/env nu

def main [args: string] {
   let config_absolute_pathname_list = (collect-config-absolute-pathname-list (collect-index-absolute-pathname-list $args))
   let config_list = ($config_absolute_pathname_list | each {|config_absolute_pathname| get-config $config_absolute_pathname })
   merge-config-list $config_list
}

# [Helper Functions]
#
def collect-values-by-key [
   on_record_or_table: closure
   item_list: list = []
]: any -> list<any> {
   let input = $in
   mut found_item_list = $item_list
   mut item_to_process_list = [$input]

   while ($item_to_process_list | is-not-empty) {
      let current_item = $item_to_process_list | first
      $item_to_process_list = $item_to_process_list | skip 1

      if (not (($current_item | describe) =~ "record|table")) {
         continue
      }

      let on_record_or_table_result = (do $on_record_or_table $current_item)
      $found_item_list = $found_item_list | append [$on_record_or_table_result]

      let current_item_values = $current_item | values
      $item_to_process_list = $item_to_process_list | append $current_item_values
   }

   $found_item_list | flatten
}

# [Functions + Raw Data]
#
def get-source-pathname-list [index_path: path]: nothing -> list<path> {
   let index = open $index_path
   $index.source
}

def get-config [
   config_path: string
]: nothing -> record<packages: record<ignore: list<string>, std: list<string>, aur: list<string>, local: list<path>>, spawn_files: list<record<owner: string, target: path, content: string>>, install_files: list<record<operation: string, owner: string, source: path, target_path: path, target_name?: string>>> {
   let config_raw = open $config_path

   let install_files = $config_raw.install_files? | default []
   let spawn_files = $config_raw.spawn_files? | default []

   let packages = {
      ignore: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "ignore" }) {
               return []
            }

            $record_or_table.ignore
         }
      )

      std: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "std" }) {
               return []
            }

            $record_or_table.std
         }
      )

      aur: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "aur" }) {
               return []
            }

            $record_or_table.aur
         }
      )

      local: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "local" }) {
               return []
            }

            $record_or_table.local
         }
      )
   }

   {
      packages: $packages
      spawn_files: $spawn_files
      install_files: $install_files
   }
}

# [Separator]
#
def collect-index-absolute-pathname-list [index_pathname: path]: nothing -> list<path> {
   # normalise by expanding unknown path type
   mut index_absolute_pathname_list_to_process = [($index_pathname | path expand)]
   mut all_index_absolute_pathname_list = []

   while ($index_absolute_pathname_list_to_process | is-not-empty) {
      let current_index_absolute_pathname_to_process = $index_absolute_pathname_list_to_process | first
      $index_absolute_pathname_list_to_process = $index_absolute_pathname_list_to_process | skip 1

      $all_index_absolute_pathname_list = $all_index_absolute_pathname_list | append $current_index_absolute_pathname_to_process

      # naming scheme for paths -> relative_path, absolute_path or path (can be either relative_path or absolute_path)

      let source_pathname_list = get-source-pathname-list $current_index_absolute_pathname_to_process

      let found_index_pathname_list = (
         $source_pathname_list
         | where {|source_pathname| $"($source_pathname | path basename)" == "index.toml" }
         | each {|source_pathname|
            if ($source_pathname | path exists) {
               $source_pathname | path expand # handles if it is relative
            } else {
               $current_index_absolute_pathname_to_process
               | path dirname
               | path join $source_pathname
               | path expand # in this scenario the path is correctly formed and path expand is used to prettify it
               # example: /users/user1/../user2 -> /users/user2
            }
         }
      )

      $all_index_absolute_pathname_list = $all_index_absolute_pathname_list | append $found_index_pathname_list
   }

   $all_index_absolute_pathname_list
}

def collect-config-absolute-pathname-list [index_absolute_pathname_list: list<path>]: nothing -> list<path> {
   (
      $index_absolute_pathname_list
      | each {|index_absolute_pathname|
         (
            get-source-pathname-list $index_absolute_pathname
            | where {|source_pathname|
               $"($source_pathname | path basename)" != "index.toml"
            } | each {|source_pathname|
               if ($source_pathname | path exists) {
                  $source_pathname | path expand
               } else {
                  $index_absolute_pathname
                  | path dirname
                  | path join $source_pathname
                  | path expand
               }
            }
         )
      } | flatten
   )
}

def merge-config-list [
   config_list: list<any> # turns out we lose the typing despite best efforts lol
]: nothing -> record<packages: record<ignore: list<string>, std: list<string>, aur: list<string>, local: list<path>>, spawn_files: list<record<owner: string, target: path, content: string>>, install_files: list<record<operation: string, owner: string, source: path, target_path: path, target_name?: string>>> {
   {
      packages: {
         ignore: ($config_list | get packages.ignore | flatten | uniq)
         std: ($config_list | get packages.std | flatten | uniq)
         aur: ($config_list | get packages.aur | flatten | uniq)
         local: ($config_list | get packages.local | flatten | uniq)
      }

      spawn_files: ($config_list | get spawn_files | flatten)
      install_files: ($config_list | get install_files | flatten)
   }
}
