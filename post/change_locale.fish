set LOCALE_CONF_FILE "/etc/locale.conf"
set LOCALE_GEN_FILE "/etc/locale.gen"

if not test -e $HOME/.old
   mkdir $HOME/.old
end

cp $LOCALE_GEN_FILE $HOME/.old
cp $LOCALE_CONF_FILE $HOME/.old

sudo sed -i -e 's/^\([^#].*\)/#\1/' $LOCALE_GEN_FILE
sudo sed -i -e "/^#en_IE.UTF-8.*/s/^#//" $LOCALE_GEN_FILE

sudo locale-gen

sudo rm $LOCALE_CONF_FILE
sudo touch $LOCALE_CONF_FILE
echo "LANG=en_IE.UTF-8" | sudo tee -a $LOCALE_CONF_FILE

# This is for the case scenario where a default is set.
echo "" | sudo tee /etc/default/locale
