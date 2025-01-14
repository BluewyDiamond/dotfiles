#!/usr/bin/env fish

rm -r build
mkdir -p build/release
esbuild src/index.ts --outdir=build/release --bundle --external:gi://\* --external:console --external:system --tsconfig=tsconfig.json --platform=neutral
GTK_VERSION=3 gjs -m build/release/index.js
