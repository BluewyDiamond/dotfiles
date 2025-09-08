#!/usr/bin/env -S nu --stdin

use std/log

def main [] {
   let item_install = $in | from nuon

   match $item_install.operation {
      copy => {
         copy-item-abs-path $item_install
      }

      link => {
         link-item-abs-path $item_install
      }
   }
}

def copy-item-abs-path [item_install] {
   let source_item_abs_path_existing_type_or_null = $item_install.source_item_abs_path | path type
   let target_item_abs_path_existing_type_or_null = $item_install.target_item_abs_path | path type

   match [$source_item_abs_path_existing_type_or_null $target_item_abs_path_existing_type_or_null] {
      [dir dir] => {
         if (
            diff
            -rq
            $item_install.target_item_abs_path
            $item_install.source_item_abs_path
         ) {
            log info $"skipping as target=($item_install.target_item_abs_path) matches with source"
            return
         }

         log info $"installing to target=($item_install.target_item_abs_path)"
         rm -r $item_install.target_item_abs_path
         cp -r $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [file file] => {
         let target_file = open --raw $item_install.target_item_abs_path
         let source_file = open --raw $item_install.source_item_abs_path

         if ($target_file == $source_file) {
            log info $"skipping as target=($item_install.target_item_abs_path) matches with source"
            return
         }

         log info $"installing to target=($item_install.target_item_abs_path)"
         rm $item_install.target_item_abs_path
         cp $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [symlink symlink] => {
         if (
            ($item_install.source_item_abs_path | path expand) ==
            ($item_install.target_item_abs_path | path expand)
         ) {
            log info $"skipping as target=($item_install.target_item_abs_path) matches with source"
            return
         }

         log info $"installing to target=($item_install.target_item_abs_path)"
         unlink $item_install.target_item_abs_path
         cp $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [file null]|[dir null]|[symlink null] => {
         let target_parent_dir_abs_path = $item_install.target_item_abs_path | path dirname

         if not ($target_parent_dir_abs_path | path exists) {
            mkdir $target_parent_dir_abs_path
         }

         log info $"installing to target=($item_install.target_item_abs_path)"
         cp -r $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ _] => { error make {msg: 'Not all patterns has been exhausted'} }
   }
}

def link-item-abs-path [item_install] {
   let source_item_abs_path_existing_type_or_null = $item_install.source_item_abs_path | path type
   let target_item_abs_path_existing_type_or_null = $item_install.target_item_abs_path | path type

   match [$source_item_abs_path_existing_type_or_null $target_item_abs_path_existing_type_or_null] {
      [file dir]|[dir dir]|[symlink dir] => {
         log info $"installing to target=($item_install.target_item_abs_path)"
         rm -r $item_install.target_item_abs_path
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [file file]|[dir file]|[symlink file] => {
         log info $"installing to target=($item_install.target_item_abs_path)"
         rm $item_install.target_item_abs_path
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [file symlink]|[dir symlink]|[symlink symlink] => {
         if (($item_install.target_item_abs_path | path expand) == $item_install.source_item_abs_path) {
            log info $"skipping as target=($item_install.target_item_abs_path) matches with source"
            return
         }

         log info $"installing to target=($item_install.target_item_abs_path)"
         unlink $item_install.target_item_abs_path
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ null] => {
         let target_parent_dir_abs_path = $item_install.target_item_abs_path | path dirname

         if not ($target_parent_dir_abs_path | path exists) {
            mkdir $target_parent_dir_abs_path
         }

         log info $"installing to target=($item_install.target_item_abs_path)"
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [null _] => {
         log error $"skipping source=($item_install.source_item_abs_path) does not exist"
      }

      [_ _] => { error make {msg: 'Not all patterns has been exhausted'} }
   }
}
