#!/usr/bin/env nu

use std/log

use ./cli/file-list.nu *
use ./cli/package-list.nu *
use ./cli/service-list.nu *
use ./extractors/config.nu *
use ./fns *

# main.nu
#
def main [index_rel_pathname: path] {
   let index_abs_pathname_list = collect-index-abs-pathname-list $index_rel_pathname
   let config_abs_pathname_list = collect-config-abs-pathname-list $index_abs_pathname_list

   let config_list = (
      $config_abs_pathname_list | each {|config_abs_pathname|
         extract-config $config_abs_pathname
      }
   )

   let config = merge-config-list $config_list
   $config
}

def "main install" [index_rel_pathname: path] {
   let index_abs_pathname_list = collect-index-abs-pathname-list $index_rel_pathname
   let config_abs_pathname_list = collect-config-abs-pathname-list $index_abs_pathname_list

   let config_list = (
      $config_abs_pathname_list | each {|config_abs_pathname|
         extract-config $config_abs_pathname
      }
   )

   let config = merge-config-list $config_list

   install-package-list $config
   install-file-list $config
   enable-service-list $config
}
