#!/usr/bin/env fish

set one ./(dirname (status -f))/files/cp_files.fish
set two ./(dirname (status -f))/tweaks/change_keyboard.fish

$one
$two
