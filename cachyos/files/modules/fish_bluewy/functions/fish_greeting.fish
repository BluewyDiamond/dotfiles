function fish_greeting
    switch $TERM
        case xterm-256color
            prompt_to_bottom_line

            if which fastfetch &>/dev/null
                fastfetch --load-config $HOME/.config/fastfetch/wezterm.jsonc
            end
        case linux
            command clear
            prompt_to_bottom_line

            if which figlet &>/dev/null
                figlet -f big "$(date +"%A, %B %d, %Y %H:%M:%S")"
            end
        case '*'
            prompt_to_bottom_line
    end
end
