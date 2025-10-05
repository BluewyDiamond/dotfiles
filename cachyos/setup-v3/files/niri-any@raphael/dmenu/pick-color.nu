#!/usr/bin/env nu

const script_dir_abs_path = path self | path dirname
const script_name = path self | path basename

def main [] {
   let color = try {
      niri msg pick-color | lines | parse "{label}: {value}"
   } catch {|error|
      save-to-log $error
      return
   }

   try {
      $color.1.value | wl-copy
      notify-send $script_name $"Copied ($color.1.value) to clipboard."
   } catch {|error|
      save-to-log $error
   }
}

def save-to-log [data: any] {
   let script_log_dir_abs_path = $script_dir_abs_path | path join 'logs'

   let script_log_file_abs_path = $script_log_dir_abs_path
   | path join ($script_name | path parse | get stem | $in + .log)

   mkdir $script_log_dir_abs_path
   $data | to text | $in + "\n------------SEPARATOR------------\n" | save -a $script_log_file_abs_path
}
