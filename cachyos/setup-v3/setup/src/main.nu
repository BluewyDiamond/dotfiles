#!/usr/bin/env nu

use std/log

use ./cli/file-list.nu *
use ./cli/package-list.nu *
use ./cli/service-list.nu *
use ./fns *

# TODO: fix requirements
# currently -> pactree, chown, diff, unlink, ln

def main [config_file_rel_path: path] {
   build-config ($config_file_rel_path | path expand)
}

def "main install" [config_file_rel_path: path] {
   let config = build-config ($config_file_rel_path | path expand)

   install-package-list $config.package_group_list
   spawn-file-list $config
   install-item-list $config
   enable-unit-list $config
}

def "main cleanup" [config_file_rel_path: path] {
   print "todo"
   # let config = build-config ($config_file_rel_path | path expand)
   #
   # cleanup-package-list $config
   # cleanup-service-list $config
}
