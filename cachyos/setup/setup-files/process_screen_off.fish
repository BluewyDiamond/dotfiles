#!/usr/bin/env fish

source ./process.fish

set working_dir (./get_working_dir.fish)

process true copy $working_dir/systemd_services/screen_off.fish /usr/local/bin/screen_off.fish
process true copy $working_dir/systemd_services/screen_off.service /etc/systemd/system/screen_off.service; and systemctl enable screen_off.service
