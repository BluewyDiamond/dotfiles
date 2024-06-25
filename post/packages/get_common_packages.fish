#!/usr/bin/env fish

set -g JSON_FILE (dirname (status -f))'/./packages.json'

jq -r '[.common | .. | .std? // empty | .[]] + [.common | .. | .aur? // empty | .[]] | unique | .[]' $JSON_FILE | sort -u
