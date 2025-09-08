#!/usr/bin/env -S nu --stdin

use std/log

def main [] {
   let item_install = $in | from nuon
   log info $"file to install at ($item_install.target_item_abs_path)"

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
   let source_item_abs_path_existing_type = ls $item_install.source_item_abs_path | get type | get 0

   let target_item_abs_path_existing_type_or_null = try {
      ls $item_install.target_item_abs_path | get type | get 0
   } catch {
      null
   }

   match [$source_item_abs_path_existing_type $target_item_abs_path_existing_type_or_null] {
      [dir dir] => {
         if (
            diff
            -rq
            $item_install.target_item_abs_path
            $item_install.source_item_abs_path
         ) {
            return
         }

         rm -r $item_install.target_item_abs_path
         cp -r $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [file file] => {
         let target_file = open --raw $item_install.target_item_abs_path
         let source_file = open --raw $item_install.source_item_abs_path

         if ($target_file == $source_file) {
            return
         }

         rm $item_install.target_item_abs_path
         cp $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [symlink symlink] => {
         if (
            ($item_install.source_item_abs_path | path expand) ==
            ($item_install.target_item_abs_path | path expand)
         ) {
            return
         }

         unlink $item_install.target_item_abs_path
         cp $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ null] => {
         let target_parent_dir_abs_path = $item_install.target_item_abs_path | path dirname

         if not ($target_parent_dir_abs_path | path exists) {
            mkdir $target_parent_dir_abs_path
         }

         cp $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ _] => { error make {msg: 'Not all patterns has been exhausted'} }
   }
}

def link-item-abs-path [item_install] {
   let source_item_abs_path_existing_type = ls $item_install.source_item_abs_path | get type | get 0

   let target_item_abs_path_existing_type_or_null = try {
      ls $item_install.target_item_abs_path | get type | get 0
   } catch {
      null
   }

   match [$source_item_abs_path_existing_type $target_item_abs_path_existing_type_or_null] {
      [_ dir] => {
         rm -r $item_install.target_item_abs_path
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ file] => {
         rm $item_install.target_item_abs_path
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ symlink] => {
         if (($item_install.target_item_abs_path | path expand) == $item_install.source_item_abs_path) {
            return
         }

         unlink $item_install.target_item_abs_path
         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ null] => {
         let target_parent_dir_abs_path = $item_install.target_item_abs_path | path dirname

         if not ($target_parent_dir_abs_path | path exists) {
            mkdir $target_parent_dir_abs_path
         }

         ln -s $item_install.source_item_abs_path $item_install.target_item_abs_path
      }

      [_ _] => { error make {msg: 'Not all patterns has been exhausted'} }
   }
}
