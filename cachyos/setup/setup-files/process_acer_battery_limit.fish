#!/usr/bin/env fish

source ./process.fish

set working_dir (./get_working_dir.fish)

process true copy $working_dir/lenovo_battery_limit_service/acer_battery_limit.fish /usr/local/bin/acer_battery_limit.fish
process true copy $working_dir/lenovo_battery_limit_service/acer_battery_limit.service /etc/systemd/system/acer_battery_limit.service; and systemctl enable acer_battery_limit
