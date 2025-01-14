#!/usr/bin/env fish

function run
    GTK_VERSION=3 gjs -m build/release/index.js
end

function build
    rm -r build
    mkdir -p build/release
    esbuild src/index.ts --outdir=build/release --bundle --external:gi://\* --external:console --external:system --tsconfig=tsconfig.json --platform=neutral
end

function types
    if test -d @girs
        rm -r @girs
    end

    mkdir -p node_modules

    if test -d node_modules/astal
        rm node_modules/astal
    end

    ln -s /usr/share/astal/gjs node_modules/astal

    npx -y @ts-for-gir/cli@4.0.0-beta.19 generate Astal\* --ignore Gtk3 --ignore Astal3 --ignoreVersionConflicts --outdir "./@girs" \
        -g /usr/share/gir-1.0
end

switch $argv[1]
    case run
        run
    case build
        build
    case types
        types
    case '*'
        echo "Unknown option..."
end
