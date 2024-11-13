#!/usr/bin/env fish

set one ./(dirname (status filename))/files/cp_files.fish
set two ./(dirname (status filename))/tweaks/change_keyboard.fish

$one
$two
