abbr dotfiles "cd $HOME/repositories/private/dotfiles"
abbr plan "cd $HOME/repositories/local/plans"

abbr snv "EDITOR=nvim sudoedit"

abbr nv nvim
abbr lg lazygit

abbr c clear
abbr e exit

# might be useful
alias fixpacman="sudo rm /var/lib/pacman/db.lck"
alias cleanup='sudo pacman -Rns (pacman -Qtdq)'

# List all files and directories including hidden files.
alias la="eza -la --color=always --icons --group-directories-first --sort=type"

# List only hidden files.
alias lh "eza -ld .* --color=always --icons --group-directories-first --sort=type"

# List only non hidden files.
alias ls "eza -l --color=always --icons --group-directories-first --sort=type"

# List in tree view non hidden files and directories.
alias lt "eza -T --color=always --icons --group-directories-first --sort=type"

# List in tree view all files and directories including hidden files.
alias lta "eza -aT --color=always --icons --group-directories-first --sort=type"

function clear
    switch $TERM
        case xterm-256color
            command clear
            prompt_to_bottom_line
            fastfetch --load-config $HOME/.config/fastfetch/wezterm.jsonc
        case linux
            command clear
            prompt_to_bottom_line
            fastfetch
        case '*'
            command clear
            prompt_to_bottom_line
    end
end

function cl --wraps cd
    cd $argv
    ls
end

function git --wraps git
    switch $argv[1]
        case plog
            command git log --oneline --decorate --graph
        case '*'
            command git $argv
    end
end

function aura
    switch $argv[1]
        case -Syy
            paru -Syy --repo $argv[2..-1]
        case -Syyu
            paru -Syyu --repo $argv[2..-1]
        case -Syu
            paru -Syu --repo $argv[2..-1]
        case -Ss
            paru -Ss --repo $argv[2]
        case -Sg
            paru -S --repo --asdeps $argv[2..-1]
        case -S
            paru -S --repo $argv[2..-1]
        case -Au
            paru -Su --aur $argv[2..-1]
        case -As
            paru -Ss --aur $argv[2]
        case -Ag
            paru -S --aur --asdeps $argv[2..-1]
        case -A
            paru -S --aur $argv[2..-1]
        case -Wyy
            paru -Syy $argv[2..-1]
        case -Wyyu
            paru -Syyu $argv[2..-1]
        case -Wyu
            paru -Syu $argv[2..-1]
        case -Ws
            paru -Ss $argv[2..-1]
        case -W
            paru $argv[2..-1]
        case '*'
           paru $argv
    end
end
