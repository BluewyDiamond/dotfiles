#!/usr/bin/env -S nu --stdin

def main [] {
   let service = $in | from nuon

   try {
      ls ($"($service.path)/*.wants/*.service" | into glob) | get name | each {|item|
         $item | path basename | path parse | get stem
      } | to nuon
   } catch {
      [] | to nuon
   }
}
