export def enable-service-list [config] {
   $config.service_list | each {|service|
      let service_enabled_list = try {
         ls ($"($service.path)/*.wants/*.service" | into glob) | get name | each {|item|
            $item | path basename | path parse | get stem
         }
      } catch {
         []
      }

      $service.enable_list | each {|service_enable|
         log info $"service to enable ($service_enable)"

         if ($service_enable not-in $service_enabled_list) {
            try {
               sudo systemctl -M $"($service.user)@" --user enable $service_enable
            } catch {|error|
               $error.rendered | print
            }
         } else {
            log warning $"service, ($service_enable), is already enabled"
         }
      }
   } | ignore
}

export def cleanup-service-list [config] {
   $config.service_list | each {|service|
      let service_enabled_list = if $service.user != $env.LOGNAME {
         try {
            ($service | sudo -u $service.user -- ./../deps/get-enabled-service-list.nu) | from nuon
         } catch {
            return
         }
      } else {
         try {
            ($service | ./../deps/get-enabled-service-list.nu) | from nuon
         } catch {
            return
         }
      }

      $service_enabled_list | each {|service_enabled|
         if ($service_enabled not-in $service_enabled_list) {
            log info $"service to disable ($service_enabled)"

            try {
               sudo systemctl -M $"($service.user)@" --user disable $service_enabled
            } catch {|error|
               $error.rendered | print
            }
         } else {
            log warning $"service, ($service_enabled), is in enable list"
         }
      }
   } | ignore
}
