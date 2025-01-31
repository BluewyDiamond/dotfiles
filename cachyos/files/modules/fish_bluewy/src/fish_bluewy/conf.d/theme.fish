switch $TERM
    case xterm-256color
       fish_config theme choose 'one_dark_custom'
    case '*'
       fish_config theme choose 'fish default'
end
