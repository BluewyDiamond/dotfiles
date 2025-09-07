#!/usr/bin/env nu

use std/log

def main [file_spawn: string] {
   let file_spawn = $file_spawn | from nuon;
   log info $"file to spawn at ($file_spawn.target_file_abs_path)"

   if ($file_spawn.target_file_abs_path | path exists) {
      if (open --raw $file_spawn.target_file_abs_path) != $file_spawn.content {
         rm -r --trash $file_spawn.target_file_abs_path
         $file_spawn.content | save ($file_spawn.target_file_abs_path)
      } else {
         log warning $"a match was found for ($file_spawn.target_file_abs_path)"
      }
   } else {
      let target_abs_path = $file_spawn.target_file_abs_path | path dirname

      if (not ($target_abs_path | path exists)) {
         mkdir ($target_abs_path)
      }

      $file_spawn.content | save ($file_spawn.target_file_abs_path)
   }
}
