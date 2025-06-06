#!/usr/bin/env fish

if which ssh
    systemctl disable --now sshd
end

if which sddm
    systemctl enable --now sddm
end
