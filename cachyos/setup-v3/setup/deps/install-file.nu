#!/usr/bin/env nu

use std/log

def main [file_install: any] {
   let file_install = $file_install | from nuon
   log info $"file to install at ($file_install.target_abs_pathname)"

   let target_abs_pathname_exists = (
      try {
         ls $file_install.target_abs_pathname | is-not-empty
      } catch {
         false
      }
   )

   let target_abs_path = $file_install.target_abs_pathname | path dirname

   match $file_install.operation {
      "copy" => {
         if $target_abs_pathname_exists {
            if ((open --raw $file_install.target_abs_pathname) != (open --raw $file_install.source_abs_pathname)) {
               rm -r --trash ($file_install.target_abs_pathname)
               cp ($file_install.source_abs_pathname) ($file_install.target_abs_pathname)
            } else {
               log warning $"a match was found at ($file_install.target_abs_pathname)"
            }
         } else {
            if (not ($target_abs_path | path exists)) {
               mkdir ($target_abs_path)
            }

            cp ($file_install.source_abs_pathname) ($file_install.target_abs_pathname)
         }
      }

      "link" => {
         if $target_abs_pathname_exists {
            if (($file_install.target_abs_pathname | path expand) != $file_install.source_abs_pathname) {
               rm -r --trash ($file_install.target_abs_pathname)
               ln -s ($file_install.source_abs_pathname) ($file_install.target_abs_pathname)
            } else {
               log warning $"a match was found at ($file_install.target_abs_pathname)"
            }
         } else {
            if (not ($target_abs_path | path exists)) {
               mkdir ($target_abs_path)
            }

            ln -s ($file_install.source_abs_pathname) ($file_install.target_abs_pathname)
         }
      }

      _ => { log error $"the operation, ($file_install.operation), is not valid" }
   }
}
