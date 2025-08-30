#!/usr/bin/env nu

def main [service_list: any] {
   systemctl --user enable psd
   # let service_list = $service_list | from nuon
   #
   # $service_list | each {|service|
   #    let service_enabled_list = ls ($"($service.path)/*.wants/*.service" | into glob) | get name | each {|x| $x | path basename | path parse | get stem }
   #
   #    $service.enable_list | each {|service_enable|
   #       log info $"service to enable ($service_enable)"
   #
   #       if ($service_enable not-in $service_enabled_list) {
   #          if ($service.user != $env.LOGNAME) {
   #             error make {msg: "wrong user"}
   #          } else {
   #             sysetmctl --user enable $service_enable
   #          }
   #       } else {
   #          log warning $"service, ($service_enable), is already enabled"
   #       }
   #    }
   # } | ignore
}
