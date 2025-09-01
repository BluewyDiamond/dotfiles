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
   let package_std_missing_list = $package_std_wanted_list | where {|package_std_wanted|
      $package_std_wanted not-in $package_installed_list
   }

   if ($package_std_missing_list | is-empty) {
      return
   }

   try {
      sudo pacman -S ...$package_std_missing_list
   } catch {|error|
      $error.rendered | print
   }
}

def install-aur-package-list [
   package_aur_wanted_list: list<string>
   package_installed_list: list<string>
] {
   let package_aur_missing_list = $package_aur_wanted_list | where {|package_aur_wanted|
      $package_aur_wanted not-in $package_installed_list
   }

   if ($package_aur_missing_list | is-empty) {
      return
   }

   try {
      paru -S --aur ...$package_aur_missing_list
   } catch {|error|
      $error.rendered | print
   }
}

def install-local-package-list [
   package_local_abs_path_wanted_list: list<string>
   package_installed_list: list<string>
] {
   let package_local_abs_path_missing_list = $package_local_abs_path_wanted_list | where {|package_local_abs_wanted|
      ($package_local_abs_wanted | path basename) not-in $package_installed_list
   }

   if ($package_local_abs_path_missing_list | is-empty) {
      return
   }

   try {
      paru -Bi ...$package_local_abs_path_missing_list
   } catch {|error|
      $error.rendered | print
   }
}

export def cleanup-package-list [config] {
   let package_local_list = $config.package.local_abs_path_list | each {|package_local_abs_path|
      $package_local_abs_path | path basename
   }

   let package_wanted_all_list = [$config.package.std_list $config.package.aur_list $package_local_list $config.package.ignore_list] | flatten
   let package_all_installed_list = pacman -Qqee | lines

   let package_unlisted_list = $package_all_installed_list | where {|package_installed|
      if ($package_installed | is-package-a-dependency) {
         false
      } else {
         $package_installed not-in $package_wanted_all_list
      }
   }

   if ($package_unlisted_list | is-not-empty) {
      sudo pacman -Rns ...$package_unlisted_list
   } else {
      log warning "no packages to cleanup"
   }
}
