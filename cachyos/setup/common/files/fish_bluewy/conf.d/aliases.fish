function la # list all
    eza -la --color=always --icons $argv
end

function lh # list only hidden
    eza -ld .* --color=always --icons $argv
end

function ls # list non hidden
    eza -l --color=always --icons $argv
end

function lt # tree view (non hidden)
    eza -T --color=always --icons $argv
end

function lth
    echo "not possible yet"
end

function lta # tree view (all)
    eza -aT --color=always --icons $argv
end

# pushes the prompt to the bottom
function clear
    command clear
    tput cup $LINES
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
    set cmd paru

    for index in (seq (count $array) -1 1)
        if string match -qr -- '^-S$' "$array[$index]"
            set -e array[$index]
            set -a cmd -S --repo
        else if string match -qr -- '^-S.*$' "$array[$index]"
            set array[$index] (string replace -r -- 'S' '' $array[$index])
            set -a cmd -S --repo
        else if string match -qr -- '^-A$' "$array[$index]"
            set -e array[$index]
            set -a cmd -S --aur
        else if string match -qr -- '^-A.*$' "$array[$index]"
            set array[$index] (string replace -r -- 'A' '' $array[$index])
            set -a cmd -S --aur
        else if string match -qr -- '^-W$' "$array[$index]"
            set -e array[$index]
            set -a cmd -S
        else if string match -qr -- '^-W.*$' "$array[$index]"
            set array[$index] (string replace -r -- 'W' '' $array[$index])
            set -a cmd -S
        end
    end

    $cmd $array
end
