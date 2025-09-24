export def extract-index-rel-path-list [index_file_rel_path: path]: nothing -> list<path> {
   let index = open $index_file_rel_path
   $index | get include
}
