function fish_greeting
    if test $TERM != linux
       sleep 0.21
    end

    fastfetch -c $HOME/.config/fastfetch/wezterm.jsonc
end
