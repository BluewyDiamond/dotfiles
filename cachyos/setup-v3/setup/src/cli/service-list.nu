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

# TODO: FIX ME
# def cleanup-service-list [config] {
#    $config.service_list | each {|service|
#       try {
#          let service_disable_list = $service_enabled_list | where {|service_enabled|
#             $service_enabled not-in $service.enabled_list
#          }
#
#          if ($service_disable_list | is-not-empty) {
#             $service_disable_list | each {|service_disable|
#                systemctl disable --now $service_disable
#             } | ignore
#          } else {
#             log warning "no services to disable"
#          }
#       } catch {|error|
#          $error.rendered | print
#       }
#    }
# }
