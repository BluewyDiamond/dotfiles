#!/usr/bin/env nu

use std/log

def main [args: string] {
   let config_absolute_pathname_list = (collect-config-absolute-pathname-list (collect-index-absolute-pathname-list $args))
   let config_list = $config_absolute_pathname_list | each {|config_absolute_pathname| get-config $config_absolute_pathname }
   $config_list | describe
   # merge-config-list ($config_list | into value)
   $config_list | into record | describe
}

def "main install" [index_pathname: path] {
   let config_absolute_pathname_list = (collect-config-absolute-pathname-list (collect-index-absolute-pathname-list $index_pathname))
   let config_list = ($config_absolute_pathname_list | each {|config_absolute_pathname| get-config $config_absolute_pathname })
   let config = merge-config-list $config_list

   # let check_and_install_packages = {|record: record<packages: list<string>, on_check: oneof<closure, nothing>, on_install: closure>|
   #    let packages = $record.packages
   #    let on_install = $record.on_install
   #    let on_check = ($record | get on_check? | default null)
   #
   #    if ($packages | is-not-empty) {
   #       let missing_packages = $packages | where {|package|
   #          if ($on_check == null) {
   #             (pacman -Q $package | complete | get exit_code) != 0
   #          } else {
   #             do $on_check $package
   #          }
   #       }
   #
   #       if ($missing_packages | is-not-empty) {
   #          do $on_install $missing_packages
   #       }
   #    }
   # }
   #
   # do $check_and_install_packages {
   #    packages: $config.packages.std
   #    on_check: null
   #
   #    on_install: {|missing_packages|
   #       sudo pacman -S ...$missing_packages
   #    }
   # }
   #
   # do $check_and_install_packages {
   #    packages: $config.packages.std
   #    on_check: null
   #
   #    on_install: {|missing_packages|
   #       paru -S --aur $missing_packages
   #    }
   # }
   #
   # do $check_and_install_packages {
   #    packages: $config.packages.local
   #
   #    on_check: {|package|
   #       pacman -Q ($package | path basename) | complete | get exit_code | $in != 0
   #    }
   #
   #    on_install: {|missing_packages|
   #       $missing_packages | each {|missing_package|
   #          dirs add $missing_package
   #          dirs
   #          makepkg -si
   #          dirs drop
   #       }
   #    }
   # }

   $config.spawn_files | each {|spawn_file|
      log debug $"spawn_file -> ($spawn_file | to text --no-newline | str replace "\n" ' ')"

      let run_as = {|record: record<str_command: string>|
         let str_command = $record.str_command

         if $spawn_file.owner != $env.LOGNAME {
            sudo -u $spawn_file.owner -- nu -c $"($str_command)"
         } else {
            nu -c $"($str_command)"
         }
      }

      try {
         if not ($spawn_file.target | path exists) {
            do $run_as {
               str_command: $"($spawn_file.content) | save ($spawn_file.target)"
            }
         } else if (open $spawn_file.target) != $spawn_file.content {
            do $run_as {
               command: $"rm --trash ($spawn_file.target)"
            }
         }
      } catch {|err|
         print $err
      }
   }

   $config.install_files | each {|install_file|
   }
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
]: nothing -> record<packages: record<ignore: list<string>, std: list<string>, aur: list<string>, local: list<path>>, spawn_files: list<record<owner: string, target: path, content: string>>, install_files: list<record<operation: string, owner: string, source: path, target_path: path, target_name?: string>>, services: record<enable: list<string>>> {
   let config_raw = open $config_path

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
         | each {|local_package_pathname|
            $config_path
            | path dirname
            | path join $local_package_pathname
            | path expand
         }
      )
   }

   {
      packages: $packages

      spawn_files: (
         $config_raw
         | get -o spawn_files
         | default []
         | each {|spawn_file|
            {
               owner: ($spawn_file | get owner)
               target: ($spawn_file | get target)
               content: ($spawn_file | get content)
            }
         }
      )

      install_files: (
         $config_raw
         | get -o install_files
         | default []
         | each {|install_file|
            {
               operation: ($install_file | get operation)
               owner: ($install_file | get owner)
               source: ($install_file | get source)
               target_path: ($install_file | get target_path)
               target_name: ($install_file | get -o target_name | default null)
            }
         }
      )

      services: {
         enable: ($config_raw | get -o services.enable | default [])
      }
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
   config_list: any
]: nothing -> record<packages: record<ignore: list<string>, std: list<string>, aur: list<string>, local: list<path>>, spawn_files: list<record<owner: string, target: path, content: string>>, install_files: list<record<operation: string, owner: string, source: path, target_path: path, target_name?: string>>, services: record<enable: list<string>>> {
   # not using get -o because it should be garanteed
   # as long as we passing the value of the getter
   # futhermore if typing was not lost we could have accessed the values directly
   {
      packages: {
         ignore: ($config_list | get packages.ignore | flatten | uniq)
         std: ($config_list | get packages.std | flatten | uniq)
         aur: ($config_list | get packages.aur | flatten | uniq)
         local: ($config_list | get packages.local | flatten | uniq)
      }

      spawn_files: ($config_list | get spawn_files | flatten)
      install_files: ($config_list | get install_files | flatten)

      services: {
         enable: ($config_list | get services.enable | flatten | uniq)
      }
   }
}
