# use ../utils *
#
# export def extract-config [
#    config_file_rel_path: string
# ]: nothing -> record<package_list: list<record<from: string, name: string, ignore: bool>>, file_spawn_list: list<record<owner: string, target_file_abs_path: path, content: string>>, item_install_list: list<record<operation: string, owner: string, source_item_abs_path: path, target_item_abs_path: path>>, unit_group_list: list<record<user: string, dir_abs_path: string, enable_list: list<string>>>> {
#    let config_raw = open $config_file_rel_path
#
#    {
#       # package: $package
#
#       file_spawn_list: (
#          $config_raw
#          | get -o spawn_files
#          | default []
#          | each {|spawn_file|
#             {
#                owner: ($spawn_file | get owner)
#                target_file_abs_path: ($spawn_file | get target)
#                content: ($spawn_file | get content)
#             }
#          }
#       )
#
#       item_install_list: (
#          $config_raw
#          | get -o install_files
#          | default []
#          | each {|install_file|
#             let source_item_abs_path = $config_file_rel_path
#             | path dirname
#             | path join ($install_file | get source)
#             | path expand
#
#             {
#                operation: ($install_file | get operation)
#                owner: ($install_file | get owner)
#
#                source_item_abs_path: (
#                   $config_file_rel_path
#                   | path dirname
#                   | path join ($install_file | get source)
#                   | path expand
#                )
#
#                target_item_abs_path: ($install_file | get target)
#             }
#          }
#       )
#
#       unit_group_list: (
#          $config_raw
#          | get -o services
#          | default []
#          | each {|service|
#             {
#                user: ($service | get user)
#                enable_list: ($service | get enable)
#                dir_abs_path: ($service | get path)
#             }
#          }
#       )
#    }
# }
