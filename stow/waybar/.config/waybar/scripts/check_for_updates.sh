#!/bin/sh

wget -q --spider https://www.archlinux.org
if [ $? -ne 0 ]; then
    echo "󱂱"
    exit 1
fi

updates=$(checkupdates | wc -l)

if [ $updates -eq 0 ]; then
    echo ""
else
    echo " "
fi
