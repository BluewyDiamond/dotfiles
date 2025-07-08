#!/usr/bin/env fish

set script_name (basename (status filename))

function print
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

function append_to_file
    set text $argv[1]
    set file $argv[2]

    echo $text | sudo tee -a $file >/dev/null
end

# main
#
# systemd-networkd
print "WARNING: This will delete existing config files (Revise the script for more details). Continue? [y/N]"
set choice (scan N)

if not string match -q -i -- Y "$choice"
    return
end

print "Are you sure? [y/N]"
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

        append_to_file "[Match]" $target
        append_to_file "Name=$adapter" $target
        append_to_file "" $target # Empty line
        append_to_file "[Network]" $target
        append_to_file "DHCP=yes" $target
        append_to_file "" $target
        append_to_file "[DHCPv4]" $target
        append_to_file "RouteMetric=100" $target
        append_to_file "" $target
        append_to_file "[IPv6AcceptRA]" $target
        append_to_file "RouteMetric=100" $target
    end

    if string match -q -i -r 'wl*' $adapter
        set target /etc/systemd/network/$counter-wireless.network

        sudo touch $target
        set counter (math $counter + 1)

        append_to_file "[Match]" $target
        append_to_file "Name=$adapter" $target
        append_to_file "" $target
        append_to_file "[Network]" $target
        append_to_file "DHCP=yes" $target
        append_to_file "" $target
        append_to_file "[DHCPv4]" $target
        append_to_file "RouteMetric=600" $target
        append_to_file "" $target
        append_to_file "[IPv6AcceptRA]" $target
        append_to_file "RouteMetric=600" $target
    end
end

# systemd-resolved
#
set resolved_conf_path /etc/systemd/resolved.conf

sudo rm $resolved_conf_path
sudo touch $resolved_conf_path

append_to_file "[Resolve]" $resolved_conf_path
append_to_file "DNS=1.1.1.1" $resolved_conf_path
append_to_file "FallbackDNS=1.0.0.1" $resolved_conf_path

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

systemctl enable iwd
systemctl enable systemd-networkd
systemctl enable systemd-resolved

systemctl list-units --type=service | grep -i network
print "Remember to disable/uninstall manually anything that can conflict with the following:"
print "1. systemd-networkd"
print "2. sysetmd-resolved"
print "3. iwd"
print "After manually resolving any conflicts, a reboot is recommended to ensure proper service initialization—unless you start them manually."
