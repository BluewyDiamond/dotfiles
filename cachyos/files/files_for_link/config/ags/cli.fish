#!/usr/bin/env fish

set parent (realpath (dirname (status filename)))
set build_dir $parent/build

if not test -d $parent
    set parent $HOME/.config/ags
end

if not test -d $parent
    echo "Paths are not valid..."
    exit 1
end

function run
    GTK_VERSION=3 gjs -m $build_dir/index.js & disown
end

function build
    if test -d $build_dir
        rm -r $build_dir
    end

    mkdir -p $build_dir
    esbuild $parent/src/index.ts --outdir=$build_dir --bundle --external:gi://\* --external:console --external:system --tsconfig=tsconfig.json --platform=neutral
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
