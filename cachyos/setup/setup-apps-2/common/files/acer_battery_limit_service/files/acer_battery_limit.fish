#!/usr/bin/env fish

echo 1 | sudo tee /sys/bus/wmi/drivers/acer-wmi-battery/health_mode
