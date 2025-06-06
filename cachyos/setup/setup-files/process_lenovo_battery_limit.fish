#!/usr/bin/env fish

source (dirname (status filename))/process.fish

set working_dir (./get_working_dir.fish)

process true copy $working_dir/lenovo_battery_limit_service/lenovo_battery_limit.fish /usr/local/bin/lenovo_battery_limit.fish
process true copy $working_dir/lenovo_battery_limit_service/lenovo_battery_limit.service /etc/systemd/system/lenovo_battery_limit.service; and systemctl enable lenovo_battery_limit
