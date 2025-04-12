#!/usr/bin/env fish

set vconsole_conf_pathname "/etc/vconsole.conf"
set font_line "FONT=ter-124n"
sudo pacman --needed terminus-font

if not test -f $vconsole_conf_pathname
    sudo touch $vconsole_conf_pathname
end

if grep -q "^FONT=" $vconsole_conf_pathname
    sudo sed -i "s/^FONT=.*/$font_line/" $vconsole_conf_pathname
else
    echo $font_line | sudo tee -a $vconsole_conf_pathname
end
