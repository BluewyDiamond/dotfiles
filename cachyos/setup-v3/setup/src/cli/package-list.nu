use ../utils *

export def install-package-list [config] {
   let package_all_installed_list = pacman -Qq | complete | get stdout | lines

   install-std-package-list $config.package.std_list $package_all_installed_list
   install-aur-package-list $config.package.aur_list $package_all_installed_list
   install-local-package-list $config.package.local_abs_path_list $package_all_installed_list
}

def install-std-package-list [
   package_std_wanted_list: list<string>
   package_installed_list: list<string>
] {
   log info 'checking std packages to install'

   let package_std_missing_list = $package_std_wanted_list | where {|package_std_wanted|
      $package_std_wanted not-in $package_installed_list
   }

   if ($package_std_missing_list | is-empty) {
      log info 'skipping as there is no std packages to install'
      return
   }

   try {
      log info 'installing std packages'
      sudo pacman -S ...$package_std_missing_list
   } catch {|error|
      $error.rendered | print
   }
}

def install-aur-package-list [
   package_aur_wanted_list: list<string>
   package_installed_list: list<string>
] {
   log info 'checking aur packages to install'

   let package_aur_missing_list = $package_aur_wanted_list | where {|package_aur_wanted|
      $package_aur_wanted not-in $package_installed_list
   }

   if ($package_aur_missing_list | is-empty) {
      log info 'skipping as there is no aur packages to install'
      return
   }

   try {
      log info 'installing aur packages'
      paru -S --aur ...$package_aur_missing_list
   } catch {|error|
      $error.rendered | print
   }
}

def install-local-package-list [
   package_local_abs_path_wanted_list: list<string>
   package_installed_list: list<string>
] {
   log info 'checking local packages to install'

   let package_local_abs_path_missing_list = $package_local_abs_path_wanted_list | where {|package_local_abs_wanted|
      ($package_local_abs_wanted | path basename) not-in $package_installed_list
   }

   if ($package_local_abs_path_missing_list | is-empty) {
      log info 'skipping as there is no local packages to install'
      return
   }

   try {
      log info 'installing local packages'
      paru -Bi ...$package_local_abs_path_missing_list
   } catch {|error|
      $error.rendered | print
   }
}

export def cleanup-package-list [config] {
   log info 'checking for packages to cleanup'

   let package_local_list = $config.package.local_abs_path_list | each {|package_local_abs_path|
      $package_local_abs_path | path basename
   }

   let package_wanted_all_list = [$config.package.std_list $config.package.aur_list $package_local_list $config.package.ignore_list] | flatten
   let package_all_installed_list = pacman -Qqee | complete | get stdout | lines

   let package_unlisted_list = $package_all_installed_list | each {|package_installed|
      if ($package_installed | is-package-a-dependency) {
         null
      } else if ($package_installed not-in $package_wanted_all_list) {
         $package_installed
      } else {
         null
      }
   } | compact

   if ($package_unlisted_list | is-not-empty) {
      log info 'cleaning up packages'
      sudo pacman -Rns ...$package_unlisted_list
   } else {
      log info 'skipping as there is no packages to cleanup'
   }
}
