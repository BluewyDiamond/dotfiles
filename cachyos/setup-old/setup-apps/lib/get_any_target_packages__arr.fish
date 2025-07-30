#!/usr/bin/env fish

set script_dir (realpath (dirname (status filename)))
set config_file $script_dir/packages.json
jq -r '[.. | .std? // empty | .[]] + [.. | .aur? // empty | .[]] | unique | .[]' $config_file | sort -u
