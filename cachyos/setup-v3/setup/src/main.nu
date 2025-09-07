#!/usr/bin/env nu

use std/log

use ./cli/file-list.nu *
use ./cli/package-list.nu *
use ./cli/service-list.nu *
use ./extractors/config.nu *
use ./fns *

# main.nu
#
def main [index_file_rel_path: path] {
   let index_file_abs_path_list = collect-index-file-abs-path-list $index_file_rel_path
   let config_file_abs_path_list = collect-config-file-abs-path-list $index_file_abs_path_list

   let config_list = (
      $config_file_abs_path_list | each {|config_file_abs_path|
         extract-config $config_file_abs_path
      }
   )

   let config = merge-config-list $config_list
   $config
}

def "main install" [index_file_rel_path: path] {
   let index_file_abs_path_list = collect-index-file-abs-path-list $index_file_rel_path
   let config_file_abs_path_list = collect-config-file-abs-path-list $index_file_abs_path_list

   let config_list = (
      $config_file_abs_path_list | each {|config_file_abs_path|
         extract-config $config_file_abs_path
      }
   )

   let config = merge-config-list $config_list

   install-package-list $config
   spawn-file-list $config
   install-item-list $config
   enable-service-list $config
}

def "main cleanup" [index_file_rel_path: path] {
   let index_file_abs_path_list = collect-index-file-abs-path-list $index_file_rel_path
   let config_file_abs_path_list = collect-config-file-abs-path-list $index_file_abs_path_list

   let config_list = (
      $config_file_abs_path_list | each {|config_file_abs_path|
         extract-config $config_file_abs_path
      }
   )

   let config = merge-config-list $config_list

   cleanup-package-list $config
   cleanup-service-list $config
}
