#!/usr/bin/env nu

const script_dir_abs_path = path self | path dirname
const script_name = path self | path basename

def main [] {
   let options = [
      "󰹑 Screenshot Screen"
      "󰹑 Screenshot Window"
      "󰆞 Screenshot Region"
      " Color Pick"
      " Kill Window"
   ]

   let fuzzel_output = try {
      $options | str join (char nl) | fuzzel --dmenu --index | str trim
   } catch {|error|
      save-to-log $error
      return
   }

   if ($fuzzel_output | is-empty) {
      return
   }

   let selected_option = try {
      ($fuzzel_output | into int) + 1
   } catch {|error|
      save-to-log $error
      return
   }

   try {
      match $selected_option {
         1 => { ($script_dir_abs_path | path join 'screenshot.nu')}
         2 => { ./screenshot.nu window }
         3 => { ./screenshot.nu region }
         4 => { ./pick-color.nu }

         5 => {
            ./kill-window.nu
         }

         _ => {
            save-to-log 'invalid option'
         }
      }
   } catch {|error|
      save-to-log $error
   }
}

def save-to-log [data: any] {
   let $script_log_dir_path = $script_dir_abs_path | path join 'logs'

   let $script_log_file_path = $script_log_dir_path
   | path join ($script_name | path parse | get stem | $in + .log)

   mkdir $script_log_dir_path
   $data | to text | $in + "\n------------SEPARATOR------------\n" | save -a $script_log_file_path
}
