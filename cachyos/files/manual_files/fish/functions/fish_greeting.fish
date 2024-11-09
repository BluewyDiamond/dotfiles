function fish_greeting
    # Fix the initial to end of the Hyprland popup animation
    # which might affect how text is rendered.
    sleep 0.1

    switch $TERM
        case xterm-256color
            prompt_to_bottom_line
            fastfetch --load-config $HOME/.config/fastfetch/wezterm.jsonc
        case linux
            command clear
            prompt_to_bottom_line
            figlet -f big "$(date +"%A, %B %d, %Y %H:%M:%S")"
        case '*'
            prompt_to_bottom_line
    end
end
