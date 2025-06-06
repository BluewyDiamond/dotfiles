#!/usr/bin/env fish

if which ssh
    systemctl enable --now sshd
end

if which sddm
    systemctl disable --now sddm
end
