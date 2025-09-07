#!/usr/bin/env nu

use std/log

def main [file_install: any] {
   let file_install = $file_install | from nuon
   log info $"file to install at ($file_install.target_item_abs_path)"

   # also makes sure source exists before proceeding
   let source_item_abs_path_existing_type = ls $file_install.source_item_abs_path | get type | get 0

   let target_item_abs_path_existing_type = try {
      ls $file_install.target_item_abs_path | get type | get 0
   } catch {
      null
   }

   match $file_install.operation {
      "copy" => {
         copy-item-abs-path $file_install
      }
   }
}

def copy-item-abs-path [file_install] {
   let source_item_abs_path_existing_type = ls $file_install.source_item_abs_path | get type | get 0

   let target_item_abs_path_existing_type = try {
      ls $file_install.target_item_abs_path | get type | get 0
   } catch {
      null
   }

   if ($target_item_abs_path_existing_type == $source_item_abs_path_existing_type) {
      let item_abs_path_existing_type = $source_item_abs_path_existing_type

      match $item_abs_path_existing_type {
         "dir" => {
            if (
               diff
               -rq
               $file_install.target_item_abs_path
               $file_install.source_item_abs_path
            ) {
               return
            }

            rm -r $file_install.target_item_abs_path
            cp -r $file_install.source_item_abs_path $file_install.target_item_abs_path
         }

         "file" => {
            let target_file = open --raw $file_install.target_item_abs_path
            let source_file = open --raw $file_install.source_item_abs_path

            if ($target_file == $source_file) {
               return
            }

            rm $file_install.target_item_abs_path
            cp $file_install.source_item_abs_path $file_install.target_item_abs_path
         }

         "symlink" => {
            if (
               ($file_install.source_item_abs_path | path expand) ==
               ($file_install.target_item_abs_path | path expand)
            ) {
               return
            }

            unlink $file_install.target_item_abs_path
            cp $file_install.source_item_abs_path $file_install.target_item_abs_path
         }
      }
   } else {
      if ($target_item_abs_path_existing_type == null) {
         cp -r $file_install.source_item_abs_path $file_install.target_item_abs_path
      } else {
         error make {msg: "unforseen state"}
      }
   }
}

def link-item-abs-path [] {
}
