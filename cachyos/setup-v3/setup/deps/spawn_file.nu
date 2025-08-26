#!/usr/bin/env nu

use std/log

def main [file_spawn: string] {
   let file_spawn = $file_spawn | from nuon;
   log info $"file to spawn at ($file_spawn.target_abs_pathname)"

   if ($file_spawn.target_abs_pathname | path exists) {
      if (open --raw $file_spawn.target_abs_pathname) != $file_spawn.content {
         rm -r --trash $file_spawn.target_abs_pathname
         $file_spawn.content | save ($file_spawn.target_abs_pathname)
      } else {
         log warning $"a match was found for ($file_spawn.target_abs_pathname)"
      }
   } else {
      let target_abs_path = $file_spawn.target_abs_pathname | path dirname

      if (not ($target_abs_path | path exists)) {
         mkdir ($target_abs_path)
      }

      $file_spawn.content | save ($file_spawn.target_abs_pathname)
   }
}
