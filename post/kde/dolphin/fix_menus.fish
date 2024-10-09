#!/bin/env fish

set -g SCRIPT_NAME (basename (status -f))
set -g WIDE_DOLPHIN_DESKTOP_ENTRY /usr/share/applications/org.kde.dolphin.desktop
set -g LOCAL_DOLPHIN_DESKTOP_ENTRY $HOME/.local/share/applications/org.kde.dolphin.desktop

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

# source: https://www.reddit.com/r/kde/comments/1bd313p/comment/l1jj937/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
sudo pacman -S --needed archlinux-xdg-menu

cp $WIDE_DOLPHIN_DESKTOP_ENTRY (dirname $LOCAL_DOLPHIN_DESKTOP_ENTRY); or exit 1

set match (grep -m1 "Exec=" $LOCAL_DOLPHIN_DESKTOP_ENTRY; or exit 1)

set prefix (string match -r "Exec=" $match)
set rest (string replace -r "Exec=" "" $match)
set modified_line "$prefix""env XDG_MENU_PREFIX=arch- kbuildsycoca6 && ""$rest"

sed -i "/^$match\$/c\\$modified_line" $LOCAL_DOLPHIN_DESKTOP_ENTRY
