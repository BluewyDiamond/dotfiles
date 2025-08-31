export def extract-source-rel-pathname-list [index_rel_path: path]: nothing -> list<path> {
   let index = open $index_rel_path
   $index | get source
}
