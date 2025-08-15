#!/usr/bin/env nu

def main [args: string] {
   let index_path_list = collect-index-pathname-list $args
   $index_path_list
}

# [Functions + Raw Data]
#
def get-source-pathname-list [index_path: string]: nothing -> list<string> {
   let index = open $index_path
   $index.source
}

def get-config [
   config_path: string
]: nothing -> record<spawn_files: list<record<owner: string, target: string, content: string>>, install_files: list<record<operation: string, owner: string, source: string, target_path: string, target_name?: string>>> {
   let config = open $config_path

   $config.install_files
   $config.install_files.owner
   $config.install_files.operation
   $config.install_files.source
   $config.install_files.target_path
   $config.install_files.target_name?

   $config.spawn_files
   $config.spawn_files.owner
   $config.spawn_files.target
   $config.spawn_files.content

   $config
}

# [Separator]
#
def collect-index-pathname-list [index_pathname: string]: nothing -> list<string> {
   # normalise by expanding unknown path type
   mut index_absolute_pathname_list_to_process = [($index_pathname | path expand)]
   mut all_index_absolute_pathname_list = []

   while ($index_absolute_pathname_list_to_process | length | $in > 0) {
      let current_index_absolute_pathname_to_process = $index_absolute_pathname_list_to_process | first
      $index_absolute_pathname_list_to_process = $index_absolute_pathname_list_to_process| skip 1

      $all_index_absolute_pathname_list = $all_index_absolute_pathname_list | append $current_index_absolute_pathname_to_process

      # paths can be abs, rel or just path (meaning might be rel or abs)

      let source_pathname_list = get-source-pathname-list $current_index_absolute_pathname_to_process

      let found_index_pathname_list = ($source_pathname_list
      | where {|source_relative_pathname| $"($source_relative_pathname | path basename)" == "index.toml"} 
      | each {|source_relative_pathname| $current_index_absolute_pathname_to_process | path dirname | path join $source_relative_pathname | path expand })

      $all_index_absolute_pathname_list = $all_index_absolute_pathname_list | append $found_index_pathname_list
   }

   $all_index_absolute_pathname_list
}
