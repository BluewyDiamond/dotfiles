#!/usr/bin/env nu

use std/log

def main [args: string] {
   let config_abs_pathname_list = (collect-config-abs-pathname-list (collect-index-abs-pathname-list $args))
   let config_list = $config_abs_pathname_list | each {|config_abs_pathname| get-config $config_abs_pathname }
   merge-config-list ($config_list)
}

def "main install" [index_rel_pathname: path] {
   let config_abs_pathname_list = (collect-config-abs-pathname-list (collect-index-abs-pathname-list $index_rel_pathname))
   let config_list = ($config_abs_pathname_list | each {|config_abs_pathname| get-config $config_abs_pathname })
   let config = merge-config-list $config_list

   let check_and_install_package_list = {|record: record<package_list: list<string>, on_check: oneof<closure, nothing>, on_install: closure>|
      let package_list = $record.package_list
      let on_install = $record.on_install
      let on_check = ($record | get on_check? | default null)

      if ($package_list | is-not-empty) {
         let missing_package_list = if $on_check == null {
            let package_installed_list = pacman -Qq ...$package_list | complete | get stdout | lines
            $package_list | where {|package| $package not-in $package_installed_list }
         } else {
            do $on_check $package_list
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
         paru -S --aur ...$missing_package_list
      }
   }

   do $check_and_install_package_list {
      package_list: $config.package.local_abs_path_list

      on_check: {|package_list|
         let package_list = $package_list | each {|package| $package | path basename }
         let package_installed_list = pacman -Qq ...$package_list | complete | get stdout | lines
         $package_list | where {|package| $package not-in $package_installed_list }
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
         print $"SPAWN FILE => target=($file_spawn.target_abs_pathname)"

         if ($file_spawn.target_abs_pathname | path exists) {
            if (open $file_spawn.target_abs_pathname) != $file_spawn.content {
               run-as $file_spawn.owner $"rm --trash ($file_spawn.target_abs_pathname)"
               run-as $file_spawn.owner $"'($file_spawn.content)' | save ($file_spawn.target_abs_pathname)"
            } else {
               print "MATCHES"
            }
         } else {
            run-as $file_spawn.owner $"'($file_spawn.content)' | save ($file_spawn.target_abs_pathname)"
         }
      } catch {|err|
         print $err
      }
   } | ignore

   $config.file_install_list | each {|file_install|
      try {
         let target_abs_pathname = $"($file_install.target_abs_path)/($file_install.source_abs_pathname | path basename)"
         print $"INSTALL FILE => target=($target_abs_pathname)"
         let target_abs_pathname_exists = (ls $target_abs_pathname | is-not-empty)

         match $file_install.operation {
            "copy" => {
               if $target_abs_pathname_exists {
                  if ((open $target_abs_pathname) != (open $file_install.source_abs_pathname)) {
                     run-as $file_install.owner $"rm --trash ($target_abs_pathname)"
                     run-as $file_install.owner $"cp ($file_install.source_abs_pathname) ($target_abs_pathname)"
                  } else {
                     print "COPY MATCHES"
                  }
               } else {
                  run-as $file_install.owner $"cp ($file_install.source_abs_pathname) ($target_abs_pathname)"
               }
            }

            "link" => {
               if $target_abs_pathname_exists {
                  if (($target_abs_pathname | path expand) != $file_install.source_abs_pathname) {
                     run-as $file_install.owner $"rm --trash ($target_abs_pathname)"
                     run-as $file_install.owner $"ln -s ($file_install.source_abs_pathname) ($target_abs_pathname)"
                  } else {
                     print "LN MATCHES"
                  }
               } else {
                  run-as $file_install.owner $"ln -s ($file_install.source_abs_pathname) ($target_abs_pathname)"
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
def get-source-rel-pathname-list [index_rel_path: path]: nothing -> list<path> {
   let index = open $index_rel_path
   $index.source
}

def get-config [
   config_rel_pathname: string
]: nothing -> record<package: record<ignore_list: list<string>, std_list: list<string>, aur_list: list<string>, local_abs_path_list: list<path>>, file_spawn_list: list<record<owner: string, target_abs_pathname: path, content: string>>, file_install_list: list<record<operation: string, owner: string, source_abs_pathname: path, target_abs_path: path, target_name?: string>>, service: record<enable_list: list<string>>> {
   let config_raw = open $config_rel_pathname

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

      local_abs_path_list: (
         $config_raw | collect-values-by-key {|record_or_table|
            if ($record_or_table | columns | all {|col| $col != "local" }) {
               return []
            }

            $record_or_table.local
         }
         | each {|local_package_rel_pathname|
            $config_rel_pathname
            | path dirname
            | path join $local_package_rel_pathname
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
               target_abs_pathname: ($spawn_file | get target)
               content: ($spawn_file | get content)
            }
         }
      )

      file_install_list: (
         $config_raw
         | get -o install_files
         | default []
         | each {|install_file|
            let source_abs_pathname = $config_rel_pathname
            | path dirname
            | path join ($install_file | get source)
            | path expand

            {
               operation: ($install_file | get operation)
               owner: ($install_file | get owner)

               source_abs_pathname: (
                  $config_rel_pathname
                  | path dirname
                  | path join ($install_file | get source)
                  | path expand
               )

               target_abs_path: ($install_file | get target_path)
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
def collect-index-abs-pathname-list [index_rel_pathname: path]: nothing -> list<path> {
   mut index_abs_pathname_list_to_process = [($index_rel_pathname | path expand)]
   mut all_index_abs_pathname_list = []

   while ($index_abs_pathname_list_to_process | is-not-empty) {
      let current_index_abs_pathname_to_process = $index_abs_pathname_list_to_process | first
      $index_abs_pathname_list_to_process = $index_abs_pathname_list_to_process | skip 1
      $all_index_abs_pathname_list = $all_index_abs_pathname_list | append $current_index_abs_pathname_to_process
      let source_rel_pathname_list = get-source-rel-pathname-list $current_index_abs_pathname_to_process

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

def collect-config-abs-pathname-list [index_abs_pathname_list: list<path>]: nothing -> list<path> {
   (
      $index_abs_pathname_list
      | each {|index_abs_pathname|
         (
            get-source-rel-pathname-list $index_abs_pathname
            | where {|source_pathname|
               $"($source_pathname | path basename)" != "index.toml"
            } | each {|source_pathname|
               if ($source_pathname | path exists) {
                  $source_pathname | path expand
               } else {
                  $index_abs_pathname
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
]: nothing -> record<package: record<ignore_list: list<string>, std_list: list<string>, aur_list: list<string>, local_abs_path_list: list<path>>, file_spawn_list: list<record<owner: string, target_abs_pathname: path, content: string>>, file_install_list: list<record<operation: string, owner: string, source_abs_pathname: path, target_abs_path: path, target_name?: string>>, service: record<enable_list: list<string>>> {
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

      service: {
         enable_list: ($config_list | get service.enable_list | flatten | uniq)
      }
   }
}
