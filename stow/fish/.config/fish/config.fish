switch $TERM
    case xterm-256color
       fish_config theme choose 'one_dark_gogh'
    case '*'
       fish_config theme choose 'fish default'
end

# format man pages
set -x MANROFFOPT "-c"
set -x MANPAGER "sh -c 'col -bx | bat -l man -p'"
