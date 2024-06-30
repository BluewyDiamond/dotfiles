#!/usr/bin/env fish

function main
    set upower (upower -i (upower -e | grep BAT))

    if test -z $upower
        print_no_battery_icon

        exit 1
    end

    set bat (echo $upower | grep percentage | awk '{print $2}' | sed 's/%//')

    if test -z $bat
        print_no_battery_icon

        exit 1
    end

    if not echo $upower | grep -q discharging
        print_battery_charging_icon $bat
    else
        print_battery_icon $bat
    end

    echo " $bat%"
end

function print_no_battery_icon
    echo "󱉝"
end

function print_battery_charging_icon
    set battery_percentage $argv[1]

    if test -e $battery_percentage 100
        echo -n "󰂅"
    else if test -ge $battery_percentage 90
        echo -n "󰂋"
    else if test -ge $battery_percentage 80
        echo -n "󰂊"
    else if test -ge $battery_percentage 70
        echo -n "󰢞"
    else if test -ge $battery_percentage 60
        echo -n "󰂉"
    else if test -ge $battery_percentage 50
        echo -n "󰢝"
    else if test -ge $battery_percentage 40
        echo -n "󰂈"
    else if test -ge $battery_percentage 30
        echo -n "󰂇"
    else if test -ge $battery_percentage 20
        echo -n "󰂆"
    else if test -ge $battery_percentage 10
        echo -n "󰢜"
    else if test -ge $battery_percentage 0
        echo -n "󰢟"
    else
        exit 1
    end
end

function print_battery_icon
    set battery_percentage $argv[1]

    if test -e $battery_percentage 100
        echo -n "󰁹"
    else if test -ge $battery_percentage 90
        echo -n "󰂂"
    else if test -ge $battery_percentage 80
        echo -n "󰂁"
    else if test -ge $battery_percentage 70
        echo -n "󰂀"
    else if test -ge $battery_percentage 60
        echo -n "󰁿"
    else if test -ge $battery_percentage 50
        echo -n "󰁾"
    else if test -ge $battery_percentage 40
        echo -n "󰁽"
    else if test -ge $battery_percentage 30
        echo -n "󰁼"
    else if test -ge $battery_percentage 20
        echo -n "󰁻"
    else if test -ge $battery_percentage 10
        echo -n "󰁺"
    else if test -ge $battery_percentage 0
        echo -n "󰂎"
    else
        exit 1
    end
end

###################
main
