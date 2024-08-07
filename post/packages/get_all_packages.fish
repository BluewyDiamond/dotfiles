#!/usr/bin/env fish

set -g JSON_FILE (dirname (status -f))'/./packages2.json'

jq -r '[.. | .std? // empty | .[]] + [.. | .aur? // empty | .[]] | unique | .[]' $JSON_FILE | sort -u
