#!/usr/bin/env fish

set script_path (realpath (dirname (status filename)))
set build_pathname $script_path/build
set build_bin_pathname $script_path/build/main.js

# specifically this script requirements
#
set required_packages bun
set required_packages_to_install

for required_package in $required_packages
    if not which $required_package 2&>/dev/null
        set -a required_packages_to_install $required_package
    end
end

if set -q required_packages_to_install[1]
    echo "[ERROR] dependencies={$required_packages_to_install} missing"
    exit 1
end

# main
#
switch $argv[1]
    case run
        LD_PRELOAD=/usr/lib/libgtk4-layer-shell.so exec gjs -m $build_pathname/main.js
    case build
        if not test -d $build_pathname
            mkdir -p $build_pathname
        end

        if test -f $build_bin_pathname
            rm $build_bin_pathname
        end

        switch $argv[2]
            case release
                bun run $script_path/build_release.ts
            case '*'
                bun run $script_path/build.ts
        end
    case types
        # ags reexports astal
        set ags_js_package_config_path /usr/share/ags/js
        set gnim_package_config_path /usr/share/ags/js/node_modules/gnim

        if not $ags_js_package_config_path
            echo "[ERROR] path={$ags_js_package_config_path} not found"
            exit 1
        end

        if not $gnim_package_config_path
            echo "[ERROR] path={$gnim_package_config_path} not found"
            exit 1
        end

        set node_modules_pathname $script_path/node_modules
        set ags_node_module_pathname $node_modules_pathname/ags
        set gnim_node_module_pathname $$node_modules_pathname/gnim

        if not test -d $node_modules_pathname
            mkdir -p $node_modules_pathname
        end

        if test -d $ags_js_package_config_path
            rm $ags_js_package_config_path
            ln -s $ags_js_package_config_path $ags_node_module_pathname
        end

        if test -d $gnim_node_module_pathname
            rm $gnim_node_module_pathname
            ln -s $$gnim_package_config_path $gnim_node_module_pathname
        end

        bunx -y @ts-for-gir/cli generate '*' \
            --ignore Gtk3 --ignore Astal3 \
            --ignoreVersionConflicts \
            --outdir $script_path/@girs \
            -g /usr/local/share/gir-1.0 \
            -g /usr/share/gir-1.0 \
            -g '/usr/share/*/gir-1.0'
    case '*'
        echo "[ERROR] unknown option"
end
