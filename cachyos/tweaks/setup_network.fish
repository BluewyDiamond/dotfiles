#!/usr/bin/env fish

set -g SCRIPT_NAME (basename (status filename))

function prompt
    set_color magenta
    echo -n "$SCRIPT_NAME => "
    set_color yellow
    echo "$argv"
    set_color normal
end

function input
    read -P (set_color magenta)"INPUT => "(set_color yellow) value

    if test -z "$value"
        set value $argv[1]
    end

    echo $value
end

function main
    systemctl list-units --type=service | grep -i network
    prompt "Remember to disable/uninstall manually anything that can conflict with the following:"
    prompt "1. systemd-networkd"
    prompt "2. sysetmd-resolved"
    prompt "3. iwd"

    prompt "Continue? [y/N]"
    set choice (input N)

    if not string match -q -i -- Y "$choice"
        return
    end

    # systemd setup

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

    # iwd setup
    sudo pacman -S --needed iwd

    set path_iwd /etc/iwd
    set path_iwd_conf "$path_iwd/main.conf"

    if test -f $path_iwd_conf
        sudo mv $path_iwd_conf "$path_iwd_conf.old"
    end

    if test -d $path_iwd
        sudo mkdir -p $path_iwd
    end

    echo "[General]" | sudo tee -a $path_iwd_conf
    echo "EnableNetworkConfiguration=true" | sudo tee -a $path_iwd_conf

    # the rest

    systemctl enable --now iwd
    systemctl enable --now systemd-networkd
    systemctl enable --now systemd-resolved
end

###################
main
