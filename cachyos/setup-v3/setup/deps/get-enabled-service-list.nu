#!/usr/bin/env -S nu --stdin

def main [] {
   let service = $in | from nuon

   ls ($"($service.path)/*.wants/*.service" | into glob) | get name | each {|item|
      $item | path basename | path parse | get stem
   } | to nuon
}
