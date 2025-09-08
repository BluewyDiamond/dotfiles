#!/usr/bin/env -S nu --stdin

use std/log

def main [] {
   let file_spawn = $in | from nuon
   let target_item_abs_path_existing_type_or_null = $file_spawn.target_file_abs_path | path type

   match $target_item_abs_path_existing_type_or_null {
      dir => {
         log info $"spawning file at target=($file_spawn.target_file_abs_path)"
         rm -r $file_spawn.target_file_abs_path
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      file => {
         let target_file = open --raw $file_spawn.target_file_abs_path

         if ($target_file == $file_spawn.content) {
            log info $"skipping as target=($file_spawn.target_file_abs_path) matches with content"
            return
         }

         log info $"spawning file at target=($file_spawn.target_file_abs_path)"
         rm $file_spawn.target_file_abs_path
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      symlink => {
         log info $"spawning file at target=($file_spawn.target_file_abs_path)"
         unlink $file_spawn.target_file_abs_path
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      null => {
         let target_parent_dir_abs_path = $file_spawn.target_file_abs_path | path dirname

         if not ($target_parent_dir_abs_path | path exists) {
            mkdir $target_parent_dir_abs_path
         }

         log info $"spawning file at target=($file_spawn.target_file_abs_path)"
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      _ => {
         error make {msg: 'Not all patterns has been exhausted'}
      }
   }
}
