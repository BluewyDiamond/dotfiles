#!/usr/bin/env fish

source (dirname (status filename))/process.fish

set working_dir (./get_working_dir.fish)

process true copy $working_dir/screen_off_service/screen_off.fish /usr/local/bin/screen_off.fish
process true copy $working_dir/screen_off_service/screen_off.service /etc/systemd/system/screen_off.service; and systemctl enable screen_off.service
