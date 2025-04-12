#!/usr/bin/env fish

XDG_MENU_PREFIX=arch- kbuildsycoca6 && dolphin $argv & disown && exit
