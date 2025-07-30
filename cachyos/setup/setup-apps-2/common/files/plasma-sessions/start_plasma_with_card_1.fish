#!/usr/bin/env fish

KWIN_DRM_DEVICES=/dev/dri/card1 /usr/lib/plasma-dbus-run-session-if-needed /usr/bin/startplasma-wayland; or /usr/bin/env KWIN_DRM_DEVICES=/dev/dri/card1 /usr/bin/startplasma-wayland
