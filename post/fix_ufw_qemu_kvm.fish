#!/usr/bin/env fish

sudo ufw allow in on virbr0 comment qemu_kvm
sudo ufw allow out on virbr0 comment qemu_kvm
sudo ufw default allow routed comment qemu_kvm
