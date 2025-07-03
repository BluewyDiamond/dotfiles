#!/usr/bin/env fish

set -g config_file (dirname (status filename))'/./packages.json'
jq -r '[.. | .std? // empty | .[]] + [.. | .aur? // empty | .[]] | unique | .[]' $config_file | sort -u
