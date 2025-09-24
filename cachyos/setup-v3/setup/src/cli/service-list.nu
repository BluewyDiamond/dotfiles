use ../utils *

export def enable-unit-list [config] {
   $config.unit_group_list | each {|unit_group|
      try {
         log info $"checking services with user=($unit_group.user) and dir_abs_path=($unit_group.dir_abs_path)"

         let service_enabled_list = (
            let service_enabled_list_or_null = get-service-enabled-list-or-null $unit_group.dir_abs_path;

            if $service_enabled_list_or_null == null {
               log error $"skipping as most likely permissions are insufficient"
               return
            } else {
               $service_enabled_list_or_null
            }
         )

         let service_enable_list = $unit_group.enable_list | where {|service_enable|
            $service_enable not-in $service_enabled_list
         }

         if ($service_enable_list | is-empty) {
            log info $"skipping as there is no services to enable"
            return
         }

         $service_enable_list | each {|service_enable|
            log info $"attempting to enable service=($service_enable) with user=($unit_group.user)"

            if (is-admin) and ($unit_group.user == root) {
               systemctl enable $service_enable
            } else if (is-admin) {
               systemctl --user -M $"($unit_group.user)@" enable $service_enable
            } else if ($unit_group.user == $env.LOGNAME) {
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
   $config.unit_group_list | each {|unit_group|
      try {
         log info $"checking units with user=($unit_group.user) and dir_abs_path=($unit_group.dir_abs_path)"
         let service_enabled_list = get-service-enabled-list-or-null $unit_group.dir_abs_path

         let units_ignore_list = $unit_group.enable_list | each {|service_enable|
            if (is-admin) and ($unit_group.user == root) {
               systemctl list-dependencies --plain --no-pager $service_enable
               | lines
               | str trim
               | where $it =~ '\.service$|\.socket$|\.timer$'
            } else if (is-admin) {
               systemctl --user -M $"($unit_group.user)@" list-dependencies --plain --no-pager $service_enable
               | lines
               | str trim
               | where $it =~ '\.service$|\.socket$|\.timer$'
            } else if ($unit_group.user == $env.LOGNAME) {
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
               ($service_enabled not-in $unit_group.enable_list) and
               ($service_enabled not-in $units_ignore_list)
            )
         }

         if ($service_disable_list | is-empty) {
            log info $"skipping as there is no services to cleanup"
            return
         }

         $service_disable_list | each {|service_disable|
            log info $"attempting to disable unit=($service_disable) with user=($unit_group.user)"

            if (is-admin) and ($unit_group.user == root) {
               systemctl disable $service_disable
            } else if (is-admin) {
               systemctl --user -M $"($unit_group.user)@" disable $service_disable
            } else if ($unit_group.user == $env.LOGNAME) {
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

def get-service-enabled-list-or-null [service_dir_abs_path: string] {
   let g = $"($service_dir_abs_path)/*.wants/*"

   # if (glob $g | is-empty) {
   #    return []
   # }

   try {
      ls ($g | into glob) | get name | each {|item|
         $item | path basename
      }
   } catch {|$error|
      if (check-what-error $error ["Permission denied"] | is-not-empty) {
         return null
      } else if (check-what-error $error ["Pattern, file or folder not found"] | is-not-empty) {
         return []
      } else {
         error make {msg: here}
      }
   }
}
