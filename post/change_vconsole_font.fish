#!/usr/bin/env fish

set vconsole_conf "/etc/vconsole.conf"
set font_line "FONT=ter-132b"

# Scenario where config file does not exist.
if not test -f $vconsole_conf
    echo Current
    echo --------------------
    echo "File is empty..."
    echo --------------------


    echo $font_line >$vconsole_conf

    echo After
    echo --------------------
    cat $vconsole_conf | grep FONT
    echo --------------------

    exit 0
end

# Scenario where config file exist.

# Scenario where line exist.
set font_present (grep -q "^$font_line" $vconsole_conf; echo $status)

if test $font_present -eq 0
    echo Current
    echo --------------------
    cat $vconsole_conf | grep FONT
    echo --------------------

    sed -i "s/^FONT=.*/$font_line/" $vconsole_conf

    echo After
    echo --------------------
    cat $vconsole_conf | grep FONT
    echo --------------------

    exit 0
end

# Scenenario where line does not exist.
echo Current
echo --------------------
cat $vconsole_conf | grep FONT
echo --------------------

echo $font_line >>$vconsole_conf

echo After
echo --------------------
cat $vconsole_conf | grep FONT
echo --------------------

exit 0
