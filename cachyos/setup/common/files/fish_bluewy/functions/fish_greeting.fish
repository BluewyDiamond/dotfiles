function fish_greeting
    if test $TERM != linux
       sleep 0.2
    end

    fastfetch -c $HOME/.config/fastfetch/wezterm.jsonc
end
