#!/usr/bin/env fish

set config_file /etc/conf.d/wireless-regdom

if test -f $config_file -a -f "$config_file.example"
    sudo rm $config_file
else if test -f $config_file
    sudo mv $config_file $config_file.example
end

sudo touch $config_file
echo "WIRELESS_REGDOM=\"ES\"" | sudo tee $config_file
