export def enable-service-list [config] {
   $config.service_list | each {|service|
      let service_enabled_list = if $service.user != $env.LOGNAME {
         $service | to nuon | sudo -u $service.user -- ./../deps/get-enabled-service-list.nu | from nuon
      } else {
         $service | to nuon | ./../deps/get-enabled-service-list.nu | from nuon
      }

      $service.enable_list | each {|service_enable|
         try {
            log info $"checking service=($service_enable)"

            if ($service_enable not-in $service_enabled_list) {
               log info $"attempting to enable service=($service_enable)"
               sudo systemctl -M $"($service.user)@" --user enable $service_enable
            } else {
               log info $"nothing to do with service=($service_enable)"
            }
         } catch {|error|
            $error.rendered | print
         }
      }
   } | ignore
}

export def cleanup-service-list [config] {
   $config.service_list | each {|service|
      let service_enabled_list = if $service.user != $env.LOGNAME {
         $service | to nuon | sudo -u $service.user -- ./../deps/get-enabled-service-list.nu | from nuon
      } else {
         $service | to nuon | ./../deps/get-enabled-service-list.nu | from nuon
      }

      $service_enabled_list | each {|service_enabled|
         try {
            log info $"checking service=($service_enabled)"

            if ($service_enabled not-in $service_enabled_list) {
               log info $"attempting to disable service=($service_enabled)"
               sudo systemctl -M $"($service.user)@" --user disable $service_enabled
            } else {
               log info $"nothing to do with service=($service_enabled)"
            }
         } catch {|error|
            $error.rendered | print
         }
      }
   } | ignore
}
