#!/usr/bin/env nu

# IMPORTANT
# This script contains relative paths thus it is important for the script to be placed correctly.
def main [] { }

def "main build" [] {
   bun ./scripts/build.ts
}

def "main run" [] {
   gjs -m build/main.js
}

def "main types" [] {
   let js_ags_abs_path = "/usr/share/ags/js"
   let js_gnim_abs_path = "/usr/share/ags/js/node_modules/gnim"
   let node_modules_rel_path = "./node_modules"
   let node_module_ags_rel_path = "./node_modules/ags"
   let node_module_gnim_rel_path = "./node_modules/gnim"
   let girs_rel_path = "./@girs"

   ls $js_ags_abs_path
   ls $js_gnim_abs_path

   let ensure_dir_exists = {|path: path|
      if ($path | path type | $in != "dir") {
         rm -r $path
      }

      if not ($path | path exists) {
         mkdir $path
      }
   }

   do $ensure_dir_exists $node_modules_rel_path

   if ($node_module_ags_rel_path | path exists) {
      rm -r $node_module_ags_rel_path
   }

   if ($node_module_gnim_rel_path | path exists) {
      rm -r $node_module_gnim_rel_path
   }

   ln -s $js_ags_abs_path $node_module_ags_rel_path
   ln -s $js_gnim_abs_path $node_module_gnim_rel_path

   if ($girs_rel_path | path exists) {
      rm -r $girs_rel_path
   }

   (
      bunx
      -y @ts-for-gir/cli generate '*'
      --ignore Gtk3 --ignore Astal3
      --ignoreVersionConflicts
      --outdir $girs_rel_path
      -g /usr/local/share/gir-1.0
      -g /usr/share/gir-1.0
      -g '/usr/share/*/gir-1.0'
   )
}
