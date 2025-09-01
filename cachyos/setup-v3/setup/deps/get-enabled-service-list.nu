#!/usr/bin/env nu

def main [service: any] {
   let service = $service | from nuon

   ls ($"($service.path)/*.wants/*.service" | into glob) | get name | each {|item|
      $item | path basename | path parse | get stem
   } | to nuon
}
