pushd ./copy

./copy.fish

popd

---

pushd ./post

./change_keyboard.fish
./change_locale.fish
./change_vsconsole_font.fish
./install_packages.fish

popd

---

pushd ./stow

for module in *
   stow $module -t $HOME
end

popd
