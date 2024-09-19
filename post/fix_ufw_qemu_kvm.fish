#!/usr/bin/env fish

sudo ufw allow in on virbr0
sudo ufw allow out on virbr0
sudo ufw default allow routed
