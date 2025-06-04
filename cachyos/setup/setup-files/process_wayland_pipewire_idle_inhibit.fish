#!/usr/bin/env fish

source ./process.fish

process false link (./get_working_dir.fish)/wayland-pipewire-idle-inhibit $HOME/.config/wayland-pipewire-idle-inhibit
