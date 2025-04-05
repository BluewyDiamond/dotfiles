#!/usr/bin/env fish

set script_name (basename (status filename))

function message
    set_color magenta
    echo -n "$script_name => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function scan
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

# main
#
# systemd-networkd
message "WARNING: This will delete existing config files (Revise the script for more details). Continue? [y/N]"
set choice (scan N)

if not string match -q -i -- Y "$choice"
    return
end

message "Are you sure? [y/N]"
set choice (scan N)

if not string match -q -i -- Y "$choice"
    return
end

sudo rm /etc/systemd/network/*
set adapter_names (command ls /sys/class/net)
set counter 20

for adapter in $adapter_names
    if string match -q -i -r 'en*' $adapter
        set target /etc/systemd/network/$counter-wired.network

        sudo touch $target
        set counter (math $counter + 1)

        echo "[Match]" | sudo tee -a $target
        echo "Name=$adapter" | sudo tee -a $target
        echo | sudo tee -a $target
        echo "[Network]" | sudo tee -a $target
        echo "DHCP=yes" | sudo tee -a $target
        echo | sudo tee -a $target
        echo "[DHCPv4]" | sudo tee -a $target
        echo "RouteMetric=100" | sudo tee -a $target
        echo | sudo tee -a $target
        echo "[IPv6AcceptRA]" | sudo tee -a $target
        echo "RouteMetric=100" | sudo tee -a $target
    end

    if string match -q -i -r 'wl*' $adapter
        set target /etc/systemd/network/$counter-wired.network

        sudo touch $target
        set counter (math $counter + 1)

        echo "[Match]" | sudo tee -a $target
        echo "Name=$adapter" | sudo tee -a $target
        echo | sudo tee -a $target
        echo "[Network]" | sudo tee -a $target
        echo "DHCP=yes" | sudo tee -a $target
        echo | sudo tee -a $target
        echo "[DHCPv4]" | sudo tee -a $target
        echo "RouteMetric=600" | sudo tee -a $target
        echo | sudo tee -a $target
        echo "[IPv6AcceptRA]" | sudo tee -a $target
        echo "RouteMetric=600" | sudo tee -a $target
    end
end

# systemd-resolved
#
set resolved_conf_path /etc/systemd/resolved.conf

sudo rm $resolved_conf_path
sudo touch $resolved_conf_path

echo "[Resolved]" | sudo tee -a $resolved_conf_path
echo "DNS=1.1.1.1" | sudo tee -a $resolved_conf_path
echo "FallbackDNS=1.0.0.1" | sudo tee -a $resolved_conf_path

# iwd
#
set iwd_dir /etc/iwd

if not test -d $iwd_dir
    sudo mkdir -p $iwd_dir
end

set iwd_conf_path "$iwd_dir/main.conf"

if test -f $iwd_conf_path
    sudo rm $iwd_conf_path
end

echo "[General]" | sudo tee -a $iwd_conf_path
echo "EnableNetworkConfiguration=true" | sudo tee -a $iwd_conf_path

systemctl enable iwd
systemctl enable systemd-networkd
systemctl enable systemd-resolved

systemctl list-units --type=service | grep -i network
message "Remember to disable/uninstall manually anything that can conflict with the following:"
message "1. systemd-networkd"
message "2. sysetmd-resolved"
message "3. iwd"
message "After manually resolving any conflicts, a reboot is recommended to ensure proper service initialization—unless you start them manually."
