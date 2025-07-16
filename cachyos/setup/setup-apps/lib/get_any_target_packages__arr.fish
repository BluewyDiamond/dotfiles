#!/usr/bin/env fish

set script_dir (dirname (realpath (status --current-filename)))
set config_file $script_dir/packages.json
jq -r '[.. | .std? // empty | .[]] + [.. | .aur? // empty | .[]] | unique | .[]' $config_file | sort -u
