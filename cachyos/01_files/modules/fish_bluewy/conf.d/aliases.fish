abbr dotfiles "cd $HOME/git/private/dotfiles"
abbr snv "EDITOR=nvim sudoedit"
abbr nv nvim
abbr lg lazygit
abbr fixpacman="sudo rm /var/lib/pacman/db.lck"

function cleanup
    set -l packages (pacman -Qtdq)

    if test $status -eq 1
        return 1
    end

    sudo pacman -Rns $packages
end

# Because eza is better overall.
#
function la
    eza -la --color=always --icons $argv
end

function lh
    eza -ld .* --color=always --icons $argv
end

function ls
    eza -l --color=always --icons $argv
end

function lt
    eza -T --color=always --icons $argv
end

function lta
    eza -aT --color=always --icons $argv
end

# Part of making the prompt to be at the bottom of the terminal.
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

# I like aura package manager but it has some bugs
# so I wrap paru to simulate aura package manager.
function aura
    set array $argv
    set cmd paru -S

    for index in (seq (count $array) -1 1)
        if string match -qr -- '^-S$' "$array[$index]"
            set -e array[$index]
            set -a cmd --repo
        else if string match -qr -- '^-S.*$' "$array[$index]"
            set array[$index] (string replace -r -- 'S' '' $array[$index])
            set -a cmd --repo
        else if string match -qr -- '^-A$' "$array[$index]"
            set -e array[$index]
            set -a cmd --aur
        else if string match -qr -- '^-A.*$' "$array[$index]"
            set array[$index] (string replace -r -- 'A' '' $array[$index])
            set -a cmd --aur
        else if string match -qr -- '^-W$' "$array[$index]"
            set -e array[$index]
        else if string match -qr -- '^-W.*$' "$array[$index]"
            set array[$index] (string replace -r -- 'W' '' $array[$index])
        end
    end

    $cmd $array
end
