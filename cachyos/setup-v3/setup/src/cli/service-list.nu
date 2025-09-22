export def enable-service-list [config] {
   $config.service_list | each {|service|
      try {
         log info $"checking services with user=($service.user) and dir_abs_path=($service.dir_abs_path)"
         let service_enabled_list = get-service-enabled-list $service.dir_abs_path

         let service_enable_list = $service.enable_list | where {|service_enable|
            $service_enable not-in $service_enabled_list
         }

         if ($service_enable_list | is-empty) {
            log info $"skipping as there is no services to enable"
            return
         }

         $service_enable_list | each {|service_enable|
            log info $"attempting to enable service=($service_enable) with user=($service.user)"

            if (is-admin) and ($service.user == root) {
               systemctl enable $service_enable
            } else if (is-admin) {
               systemctl --user -M $"($service.user)@" enable $service_enable
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
         log info $"checking units with user=($service.user) and dir_abs_path=($service.dir_abs_path)"
         let service_enabled_list = get-service-enabled-list $service.dir_abs_path

         let units_ignore_list = $service.enable_list | each {|service_enable|
            if (is-admin) and ($service.user == root) {
               systemctl list-dependencies --plain --no-pager $service_enable
               | lines
               | str trim
               | where $it =~ '\.service$|\.socket$|\.timer$'
            } else if (is-admin) {
               systemctl --user -M $"($service.user)@" list-dependencies --plain --no-pager $service_enable
               | lines
               | str trim
               | where $it =~ '\.service$|\.socket$|\.timer$'
            } else if ($service.user == $env.LOGNAME) {
               systemctl --user list-dependencies --plain --no-pager $service_enable
               | lines
               | str trim
               | where $it =~ '\.service$|\.socket$|\.timer$'
            } else {
               log error "skipped as conditions are not fufilled"
               error make {msg: "i cant have this fail atm"}
            }
         }
         | flatten
         | uniq

         let service_disable_list = $service_enabled_list | where {|service_enabled|
            (
               ($service_enabled not-in $service.enable_list) and
               ($service_enabled not-in $units_ignore_list)
            )
         }

         if ($service_disable_list | is-empty) {
            log info $"skipping as there is no services to cleanup"
            return
         }

         $service_disable_list | each {|service_disable|
            log info $"attempting to disable unit=($service_disable) with user=($service.user)"

            if (is-admin) and ($service.user == root) {
               systemctl disable $service_disable
            } else if (is-admin) {
               systemctl --user -M $"($service.user)@" disable $service_disable
            } else if ($service.user == $env.LOGNAME) {
               systemctl --user disable $service_disable
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
   let g = $"($service_dir_abs_path)/*.wants/*"

   if (glob $g | is-empty) {
      return []
   }

   ls ($g | into glob) | get name | each {|item|
      $item | path basename
   }
}
