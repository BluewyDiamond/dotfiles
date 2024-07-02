set LOCALE_CONF_FILE "/etc/locale.conf"
set LOCALE_GEN_FILE "/etc/locale.gen"
set DEFAULT_LOCALE_FILE /etc/default/locale

if test -e $LOCALE_GEN_FILE
    sudo mv $LOCALE_GEN_FILE "$LOCALE_GEN_FILE.old"
    touch $LOCALE_GEN_FILE
    echo "en_IE.UTF-8 UTF-8" | suddo tee -a $LOCALE_GEN_FILE
    sudo locale-gen
else
    echo "script: unable to find $LOCALE_GEN_FILE -> skipping..."
end


if test -e $LOCALE_CONF_FILE
    sudo mv $LOCALE_CONF_FILE "$LOCALE_CONF_FILE.old"
    sudo touch $LOCALE_CONF_FILE
    echo "LANG=en_IE.UTF-8" | sudo tee -a $LOCALE_CONF_FILE
else
    echo "script: unable to find $LOCALE_CONF_FILE -> skipping..."
end

if not test -e $DEFAULT_LOCALE_FILE
    echo "" | sudo tee $DEFAULT_LOCALE_FILE
else
    echo "script: unable to find $DEFAULT_LOCALE_FILE -> skipping..."
end
