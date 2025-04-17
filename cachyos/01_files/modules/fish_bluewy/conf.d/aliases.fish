abbr dotfiles "cd $HOME/git/private/dotfiles"

abbr snv "EDITOR=nvim sudoedit"

abbr nv nvim
abbr lg lazygit

# might be useful
alias fixpacman="sudo rm /var/lib/pacman/db.lck"

function cleanup
    set -l packages (pacman -Qtdq)

    if test $status -eq 1
        return 1
    end

    sudo pacman -Rns $packages
end

# List all files and directories including hidden files.
function la
    eza -la --color=always --icons $argv
end

# List only hidden files.
function lh
    eza -ld .* --color=always --icons $argv
end

# List only non-hidden files.
function ls
    eza -l --color=always --icons $argv
end

# List in tree view non-hidden files and directories.
function lt
    eza -T --color=always --icons $argv
end

# List in tree view all files and directories including hidden files.
function lta
    eza -aT --color=always --icons $argv
end

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

function git --wraps git
    switch $argv[1]
        case plog
            command git log --oneline --decorate --graph
        case '*'
            command git $argv
    end
end

function aura
    set line $argv

    if string match -qr -- S $line
        set rest (string replace -r -- '(-S|S )' '' $line)
        paru -S --repo $rest
    else if string match -qr -- A $line
        set rest (string replace -r -- '(-A|A )' '' $line)
        paru -S --aur $rest
    end
end
