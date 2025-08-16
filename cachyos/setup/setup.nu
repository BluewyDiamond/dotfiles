#!/usr/bin/env nu

def main [args: string] {
   let config_absolute_pathname_list = (collect-config-absolute-pathname-list (collect-index-absolute-pathname-list $args))

   get-config $config_absolute_pathname_list.0
}

# [Helper Functions]
#
export def cherry-pick [
   selector: closure
   list: list = []
] {
   let input = $in
   mut selected_value_list = $list
   mut queue = [$input]

   while not ($queue | is-empty) {
      let current_item = $queue | first
      $queue = $queue | skip 1

      if ($current_item | describe) =~ "record|table" {
         let selector_result = (do $selector $current_item)

         if ($selector_result != null) {
            $selected_value_list = $selected_value_list | append [$selector_result]
         }

         let current_item_values = $current_item | values
         $queue = $queue | append $current_item_values
      }
   }

   $selected_value_list | flatten
}

# [Functions + Raw Data]
#
def get-source-pathname-list [index_path: path]: nothing -> list<path> {
   let index = open $index_path
   $index.source
}

def get-config [
   config_path: string
]: nothing -> record<packages: record<std: list<string>, aur: list<string>>, spawn_files: list<record<owner: string, target: path, content: string>>, install_files: list<record<operation: string, owner: string, source: path, target_path: path, target_name?: string>>> {
   let config_raw = open $config_path

   let install_files = if ($config_raw.install_files? != null) {
      $config_raw.install_files
   } else {
      []
   }

   let spawn_files = if ($config_raw.spawn_files? != null) {
      $config_raw.spawn_files
   } else {
      []
   }

   let packages = {
      std: ($config_raw | cherry-pick {|x| $x.std? })
      aur: ($config_raw | cherry-pick {|x| $x.aur? })
   }

   {
      packages: $packages
      install_files: $install_files
      spawn_files: $spawn_files
   }
}

# [Separator]
#
def collect-index-absolute-pathname-list [index_pathname: path]: nothing -> list<path> {
   # normalise by expanding unknown path type
   mut index_absolute_pathname_list_to_process = [($index_pathname | path expand)]
   mut all_index_absolute_pathname_list = []

   while ($index_absolute_pathname_list_to_process | length | $in > 0) {
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
