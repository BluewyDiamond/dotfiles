#!/usr/bin/env -S nu --stdin

use std/log

def main [] {
   let file_spawn = $in;
   log info $"file to spawn at ($file_spawn.target_file_abs_path)"

   let target_item_abs_path_existing_type_or_null = try {
      ls $file_spawn.target_file_abs_path | get type | get 0
   } catch {
      null
   }

   match $target_item_abs_path_existing_type_or_null {
      dir => {
         rm -r $file_spawn.target_file_abs_path
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      file => {
         let target_file = open --raw $file_spawn.target_file_abs_path

         if ($target_file != $file_spawn.content) {
            return
         }

         rm $file_spawn.target_file_abs_path
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      symlink => {
         unlink $file_spawn.target_file_abs_path
         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      null => {
         let target_parent_dir_abs_path = $file_spawn.target_file_abs_path | path dirname

         if not ($target_parent_dir_abs_path | path exists) {
            mkdir $target_parent_dir_abs_path
         }

         $file_spawn.content | save $file_spawn.target_file_abs_path
      }

      _ => {
         error make {msg: 'Not all patterns has been exhausted'}
      }
   }
}
