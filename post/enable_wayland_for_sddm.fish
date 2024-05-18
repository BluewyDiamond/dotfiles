#!/usr/bin/env fish

if not test -e $HOME/.old
    mkdir $HOME/.old
end

cp /etc/sddm.conf $HOME/.old
cp /etc/sddm.conf.d $HOME/.old

sudo rm /etc/sddm.conf
sudo rm -r /etc/sddm.conf.d

sudo touch /etc/sddm.conf
sudo mkdir /etc/sddm.conf.d
sudo touch /etc/sddm.conf.d/10-wayland.conf

echo -e "[Theme]\nCurrent=" | sudo tee -a /etc/sddm.conf

echo -e "[General]\nDisplayServer=wayland" | sudo tee -a /etc/sddm.conf.d/10-wayland.conf
echo -e "GreeterEnvironment=QT_WAYLAND_SHELL_INTEGRATION=layer-shell" | sudo tee -a /etc/sddm.conf.d/10-wayland.conf
echo -e "[Wayland]\nCompositorCommand=kwin_wayland --drm --no-lockscreen --no-global-shortcuts --locale1" | sudo tee -a /etc/sddm.conf.d/10-wayland.conf
