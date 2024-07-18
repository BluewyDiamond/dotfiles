#!/usr/bin/env fish

set VCONSOLE_CONF "/etc/vconsole.conf"
set FONT "FONT=ter-132b"

if not test -f $VCONSOLE_CONF
    sudo touch $VCONSOLE_CONF
end

if grep -q "^FONT=" $VCONSOLE_CONF
    sudo sed -i "s/^FONT=.*/$FONT/" $VCONSOLE_CONF
else
    echo $FONT | sudo tee -a $VCONSOLE_CONF
end
