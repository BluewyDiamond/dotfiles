#!/usr/bin/env fish

# Checks if there are any arguments
# and deal with it accordingly.
if test (count $argv) -eq 0
    echo "Simple script that cycles wallpapers using swww"
    echo ""
    echo "Usage: SCRIPT <OPTION>"
    echo ""
    echo "Available Options:"
    echo "    --wallpapers-path <PATH>"

    exit 1
else
    if string match -q -- --wallpapers-path "$argv[1]"
        if test -z "$argv[2]"
            echo "No path specified..."
            exit 1
        end

        eval set -g WALLPAPERS "$argv[2]/*"
    end
end

set CURRENT_WALL_VALUE (cat /tmp/wallpaper)
set CURRENT_WALL_INDEX_FILE /tmp/wallpaper
set MAX_WALLPAPER_COUNT (count $WALLPAPERS)

echo "Wallpapers: $MAX_WALLPAPER_COUNT"
echo "Wallpaper index in file: $CURRENT_WALL_VALUE"

if test -e $CURRENT_WALL_INDEX_FILE
    echo "File exists... Good"
else
    echo "File does not exist... Creating said file"
    touch $CURRENT_WALL_INDEX_FILE
end

if test -z $CURRENT_WALL_VALUE
    echo "File is empty... Inserting random value"
    echo 0 >>$CURRENT_WALL_INDEX_FILE
else
    echo "File is not empty... Good"
end

# Adds one to current index.
set var $CURRENT_WALL_VALUE
set var (math "$var + 1")
echo "Current Index Value: $var"


echo "Setting wallpaper: $WALLPAPERS[$var]"

set effects fade left right top bottom wipe wave grow center any outer
set array_length (count $effects)
set random_index (random 1 $array_length)
set random_value $effects[$random_index]

# Changes background wallpaper.
if not swww img --transition-fps 240 --transition-type $random_value $WALLPAPERS[$var]
    echo "Failed..."
    echo "Exiting early"
    exit 1
end

# Checks so value does not go out of bounds
# if it does reset either way.
if test "$var" -ge "$MAX_WALLPAPER_COUNT"
    echo "Last Wallpaper.. Reseting counter"
    # Reset counter
    set var 0
else
    echo "Not last wallpaper.. All good"
end

# Updates index file value.
rm $CURRENT_WALL_INDEX_FILE
touch $CURRENT_WALL_INDEX_FILE
echo "$var" >>$CURRENT_WALL_INDEX_FILE
