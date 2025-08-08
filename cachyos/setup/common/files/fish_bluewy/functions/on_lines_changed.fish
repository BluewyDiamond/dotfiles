set -g _LINES 0

function on_lines_changed --on-variable LINES
    # alternative instead of tput cup
    # printf '\033[%d;1H' $LINES >/dev/tty
    # commandline -f repaint

    if test $LINES = $_LINES
        return
    end

    set new_lines (math $LINES - $_LINES)

    if test $new_lines -lt 0
        # there are less lines
        # also won't be zero cause of the earlier check
        return
    end

    tput cup $new_lines
end

on_lines_changed
