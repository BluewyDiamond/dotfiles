#!/usr/bin/env fish

set parent (realpath (dirname (status filename)))
set build_dir $parent/build
set ts_for_gir @ts-for-gir/cli@4.0.0-beta.19
set astal_gjs_dir /usr/share/astal/gjs
set gir_dir /usr/share/gir-1.0

if not test -d $parent
    set parent $HOME/.config/ags
end

if not test -d $parent
    echo "Paths are not valid..."
    exit 1
end

function run
    LD_PRELOAD=/usr/lib/libgtk4-layer-shell.so gjs -m $build_dir/main.js
end

function drun
    LD_PRELOAD=/usr/lib/libgtk4-layer-shell.so gjs -m $build_dir/main.js & disown && exit
end

function build
    if test -e $build_dir/main.js
        rm $build_dir/main.js
    end

    mkdir -p $build_dir
    bun build --minify --target bun --external gi://\* --external file://\* --external resource://\* --external system --external console --external cairo --external gettext --outdir=$build_dir -- $parent/src/main.ts
end

function types
    if test -d @girs
        rm -r @girs
    end

    if not test -d node_modules
        mkdir -p node_modules
    end

    if test -d node_modules/astal
        rm node_modules/astal
    end

    ln -s $astal_gjs_dir node_modules/astal

    bunx $ts_for_gir generate \* --ignore Gtk3 --ignore Astal3 --ignoreVersionConflicts --outdir "./@girs" \
        -g $gir_dir
end

switch $argv[1]
    case drun
        drun
    case run
        run
    case build
        build
    case types
        types
    case '*'
        echo "Unknown option..."
end
