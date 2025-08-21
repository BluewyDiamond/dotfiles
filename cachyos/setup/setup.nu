#!/usr/bin/env nu

use std/log

def main [args: string] {
   let config_absolute_pathname_list = (collect-config-absolute-pathname-list (collect-index-absolute-pathname-list $args))
   let config_list = $config_absolute_pathname_list | each {|config_absolute_pathname| get-config $config_absolute_pathname }
   merge-config-list ($config_list)
}

def "main install" [index_pathname: path]: nothing -> nothing {
   let config_absolute_pathname_list = (collect-config-absolute-pathname-list (collect-index-absolute-pathname-list $index_pathname))
   let config_list = ($config_absolute_pathname_list | each {|config_absolute_pathname| get-config $config_absolute_pathname })
   let config = merge-config-list $config_list

   let check_and_install_package_list = {|record: record<package_list: list<string>, on_check: oneof<closure, nothing>, on_install: closure>|
      let package_list = $record.package_list
      let on_install = $record.on_install
      let on_check = ($record | get on_check? | default null)

      if ($package_list | is-not-empty) {
         let missing_package_list = $package_list | where {|package|
            if ($on_check == null) {
               (pacman -Q $package | complete | get exit_code) != 0
            } else {
               do $on_check $package
            }
         }

         if ($missing_package_list | is-not-empty) {
            do $on_install $missing_package_list
         }
      }
   }

   do $check_and_install_package_list {
      package_list: $config.package.std_list
      on_check: null

      on_install: {|missing_package_list|
         sudo pacman -S ...$missing_package_list
      }
   }

   do $check_and_install_package_list {
      package_list: $config.package.aur_list
      on_check: null

      on_install: {|missing_package_list|
         paru -S --aur $missing_package_list
      }
   }

   do $check_and_install_package_list {
      package_list: $config.package.local_path_list

      on_check: {|package|
         pacman -Q ($package | path basename) | complete | get exit_code | $in != 0
      }

      on_install: {|missing_package_list|
         $missing_package_list | each {|missing_package_list|
            dirs add $missing_package_list
            dirs
            makepkg -si
            dirs drop
         }
      }
   }

   $config.file_spawn_list | each {|file_spawn|
      try {
         if ($file_spawn.target_pathname | path exists) {
            if (open $file_spawn.target_pathname) != $file_spawn.content {
               run-as $file_spawn.owner $"rm --trash ($file_spawn.target_pathname)"
               run-as $file_spawn.owner $"'($file_spawn.content)' | save ($file_spawn.target_pathname)"
            } else {
               print "MATCHES"
            }
         } else {
            run-as $file_spawn.owner $"'($file_spawn.content)' | save ($file_spawn.target_pathname)"
         }
      } catch {|err|
         print $err
      }
   } | ignore

   $config.file_install_list | each {|file_install|
      try {
         let target_pathname = $"($file_install.target_path)/($file_install.source_pathname | path basename)"
         let target_pathname_exists = (ls $target_pathname | is-not-empty)

         match $file_install.operation {
            "copy" => {
               if $target_pathname_exists {
                  if ((open $target_pathname) != (open $file_install.source_pathname)) {
                     run-as $file_install.owner $"rm --trash ($target_pathname)"
                     run-as $file_install.owner $"cp ($file_install.source_pathname) ($target_pathname)"
                  } else {
                     print "COPY MATCHES"
                  }
               } else {
                  run-as $file_install.owner $"cp ($file_install.source_pathname) ($target_pathname)"
               }
            }

            "link" => {
               if $target_pathname_exists {
                  if (($target_pathname | path expand) != $file_install.source_pathname) {
                     run-as $file_install.owner $"rm --trash ($target_pathname)"
                     run-as $file_install.owner $"ln -s ($file_install.source_pathname) ($target_pathname)"
                  } else {
                     print "LN MATCHES"
                  }
               } else {
                  run-as $file_install.owner $"ln -s ($file_install.source_pathname) ($target_pathname)"
               }
            }

            _ => { log error "OPERATION NOT VALID" }
         }
      } catch {|err|
         print $err.rendered
      }
   } | ignore
}

def run-as [owner: string nu_cmd: string] {
   if $owner != $env.LOGNAME {
      run-external ...["sudo" "-u" $owner "--" $nu.current-exe "-c" $nu_cmd]
   } else {
      run-external ...[$nu.current-exe "-c" $nu_cmd]
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
   config_pathname: string
]: nothing -> record<package: record<ignore_list: list<string>, std_list: list<string>, aur_list: list<string>, local_path_list: list<path>>, file_spawn_list: list<record<owner: string, target_pathname: path, content: string>>, file_install_list: list<record<operation: string, owner: string, source_pathname: path, target_path: path, target_name?: string>>, service: record<enable_list: list<string>>> {
   let config_raw = open $config_pathname

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

      local_path_list: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "local" }) {
               return []
            }

            $record_or_table.local
         }
         | each {|local_package_pathname|
            $config_pathname
            | path dirname
            | path join $local_package_pathname
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
               target_pathname: ($spawn_file | get target)
               content: ($spawn_file | get content)
            }
         }
      )

      file_install_list: (
         $config_raw
         | get -o install_files
         | default []
         | each {|install_file|
            let source_pathname = $config_pathname
            | path dirname
            | path join ($install_file | get source)
            | path expand

            {
               operation: ($install_file | get operation)
               owner: ($install_file | get owner)
               source_pathname: (
                  $config_pathname
                  | path dirname
                  | path join ($install_file | get source)
                  | path expand
               )

               target_path: ($install_file | get target_path)

               target_name: ($install_file | get -o target_name | default null)
            }
         }
      )

      service: {
         enable_list: ($config_raw | get -o services.enable | default [])
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
]: nothing -> record<package: record<ignore_list: list<string>, std_list: list<string>, aur_list: list<string>, local_path_list: list<path>>, file_spawn_list: list<record<owner: string, target_pathname: path, content: string>>, file_install_list: list<record<operation: string, owner: string, source_pathname: path, target_path: path, target_name?: string>>, service: record<enable_list: list<string>>> {
   # not using get -o because it should be garanteed
   # as long as we passing the value of the getter
   # futhermore if typing was not lost we could have accessed the values directly
   {
      package: {
         ignore_list: ($config_list | get package.ignore_list | flatten | uniq)
         std_list: ($config_list | get package.std_list | flatten | uniq)
         aur_list: ($config_list | get package.aur_list | flatten | uniq)
         local_path_list: ($config_list | get package.local_path_list | flatten | uniq)
      }

      file_spawn_list: ($config_list | get file_spawn_list | flatten)
      file_install_list: ($config_list | get file_install_list | flatten)

      service: {
         enable_list: ($config_list | get service.enable_list | flatten | uniq)
      }
   }
}
