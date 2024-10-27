#!/usr/bin/env fish

set -g SCRIPT_NAME (basename (status -f))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z $value
        set $argv[1] # default value, allows me to early return
    end

    echo $value
end

function main
    systemctl list-units --type=service | grep -i network
    prompt "Disable or remove anything that can conflict with systemd-networkd + systemd-resolved + iwd!"
    prompt "Proceed? [y/N]"

    set choice (input N)

    if string match -q -i -- N "$choice"
        return
    end

    sudo rm /etc/systemd/network/*

    set adapter_names (command ls /sys/class/net)

    set counter 20

    for adpater in $adapter_names
        if string match -q -i -r 'en*'
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

        if string match -q -i -r 'wl*'
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


    sudo pacman -S --needed iwd

    systemctl enable --now iwd
    systemctl enable --now systemd-networkd
    systemctl enable --now systemd-resolved
end

###################
main
