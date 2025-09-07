#!/usr/bin/env nu

use std/log

def main [file_install] {
   let file_install = $file_install | from nuon
   log info $"file to install at ($file_install.target_item_abs_path)"

   match $file_install.operation {
      copy => {
         copy-item-abs-path $file_install
      }

      link => {
         link-item-abs-path $file_install
      }
   }
}

def copy-item-abs-path [file_install] {
   let source_item_abs_path_existing_type = ls $file_install.source_item_abs_path | get type | get 0

   let target_item_abs_path_existing_type_or_null = try {
      ls $file_install.target_item_abs_path | get type | get 0
   } catch {
      null
   }

   match [$source_item_abs_path_existing_type $target_item_abs_path_existing_type_or_null] {
      [dir dir] => {
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

      [file file] => {
         let target_file = open --raw $file_install.target_item_abs_path
         let source_file = open --raw $file_install.source_item_abs_path

         if ($target_file == $source_file) {
            return
         }

         rm $file_install.target_item_abs_path
         cp $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [symlink symlink] => {
         if (
            ($file_install.source_item_abs_path | path expand) ==
            ($file_install.target_item_abs_path | path expand)
         ) {
            return
         }

         unlink $file_install.target_item_abs_path
         cp $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [_ null] => {
         cp $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [_ _] => { error make {msg: 'Not all patterns has been exhausted'} }
   }
}

def link-item-abs-path [file_install] {
   let source_item_abs_path_existing_type = ls $file_install.source_item_abs_path | get type | get 0

   let target_item_abs_path_existing_type_or_null = try {
      ls $file_install.target_item_abs_path | get type | get 0
   } catch {
      null
   }

   match [$source_item_abs_path_existing_type $target_item_abs_path_existing_type_or_null] {
      [_ dir] => {
         rm -r $file_install.target_item_abs_path
         ln -s $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [_ file] => {
         rm $file_install.target_item_abs_path
         ln -s $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [_ symlink] => {
         if (($file_install.target_item_abs_path | path expand) == $file_install.source_item_abs_path) {
            return
         }

         unlink $file_install.target_item_abs_path
         ln -s $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [_ null] => {
         ln -s $file_install.source_item_abs_path $file_install.target_item_abs_path
      }

      [_ _] => { error make {msg: 'Not all patterns has been exhausted'} }
   }
}
