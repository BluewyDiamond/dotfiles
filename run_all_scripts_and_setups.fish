./copy/copy.fish

./post/install_packages_v2.fish
./post/change_keyboard.fish
./post/change_vsconsole_font.fish
./post/install_packages_v2.fish

for module in $PWD/stow/profiles/profile-1/*
    stow $module -t $HOME
end
