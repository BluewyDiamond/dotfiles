function fish_greeting
    switch $TERM
        case xterm-256color
            tput cup $LINES

            if which fastfetch &>/dev/null
                fastfetch --load-config $HOME/.config/fastfetch/wezterm.jsonc
            end
        case linux
            command clear
            tput cup $LINES

            if which figlet &>/dev/null
                figlet -f big "$(date +"%A, %B %d, %Y %H:%M:%S")"
            end
        case '*'
            tput cup $LINES
    end
end
