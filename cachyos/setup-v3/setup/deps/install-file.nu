#!/usr/bin/env nu

use std/log

def main [file_install: any] {
   let file_install = $file_install | from nuon
   log info $"file to install at ($file_install.target_file_abs_path)"

   let target_file_abs_path_exists = (
      try {
         ls $file_install.target_file_abs_path | is-not-empty
      } catch {
         false
      }
   )

   let target_abs_path = $file_install.target_file_abs_path | path dirname

   match $file_install.operation {
      "copy" => {
         if $target_file_abs_path_exists {
            if ((open --raw $file_install.target_file_abs_path) != (open --raw $file_install.source_file_abs_path)) {
               rm -r --trash ($file_install.target_file_abs_path)
               cp ($file_install.source_file_abs_path) ($file_install.target_file_abs_path)
            } else {
               log warning $"a match was found at ($file_install.target_file_abs_path)"
            }
         } else {
            if (not ($target_abs_path | path exists)) {
               mkdir ($target_abs_path)
            }

            cp ($file_install.source_file_abs_path) ($file_install.target_file_abs_path)
         }
      }

      "link" => {
         if $target_file_abs_path_exists {
            if (($file_install.target_file_abs_path | path expand) != $file_install.source_file_abs_path) {
               rm -r --trash ($file_install.target_file_abs_path)
               ln -s ($file_install.source_file_abs_path) ($file_install.target_file_abs_path)
            } else {
               log warning $"a match was found at ($file_install.target_file_abs_path)"
            }
         } else {
            if (not ($target_abs_path | path exists)) {
               mkdir ($target_abs_path)
            }

            ln -s ($file_install.source_file_abs_path) ($file_install.target_file_abs_path)
         }
      }

      _ => { log error $"the operation, ($file_install.operation), is not valid" }
   }
}
