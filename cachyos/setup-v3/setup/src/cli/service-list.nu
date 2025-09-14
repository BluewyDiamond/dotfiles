export def enable-service-list [config] {
   $config.service_list | each {|service|
      try {
         let service_enabled_list = get-service-enabled-list $service.dir_abs_path

         $service.enable_list | each {|service_enable|
            log info $"checking service=($service_enable)"

            if ($service_enable in $service_enabled_list) {
               log info $"skipping as service=($service_enable) is already enabled"
               return
            }

            log info $"attempting to enable service=($service_enable)"

            if (is-admin) and ($service.user == root) {
               systemctl enable $service_enable
            } else if (is-admin) {
               systemctl -M --user $"($service.user)@" enable $service_enable
            } else if ($service.user == $env.LOGNAME) {
               systemctl --user enable $service_enable
            } else {
               log error "skipped as conditions are not fufilled"
            }
         }
      } catch {|error|
         $error | print
      }
   } | ignore
}

export def cleanup-service-list [config] {
   $config.service_list | each {|service|
      try {
         let service_enabled_list = get-service-enabled-list $service.dir_abs_path

         $service_enabled_list | each {|service_enabled|
            log info $"checking service=($service_enabled)"

            if ($service_enabled in $service_enabled_list) {
               log info $"skipping as service=($service_enabled) is already disabled"
               return
            }

            log info $"attempting to disable service=($service_enabled)"

            if (is-admin) and ($service.user == root) {
               systemctl disable $service_enabled
            } else if (is-admin) {
               sudo systemctl --user -M $"($service.user)@" disable $service_enabled
            } else if ($service.user == $env.LOGNAME) {
               systemctl --user disable $service_enabled
            } else {
               log error "skipped as conditions are not fufilled"
            }
         }
      } catch {|error|
         $error | print
      }
   } | ignore
}

def get-service-enabled-list [service_dir_abs_path: string] {
   if not ($service_dir_abs_path | path exists) {
      return []
   }

   ls $"($service_dir_abs_path)/*.wants/*.service" | into glob | get name | each {|item|
      $item | path basename | path parse | get stem
   }
}
