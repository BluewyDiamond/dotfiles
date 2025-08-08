function on_lines_changed --on-variable LINES
    printf '\033[%d;1H' $LINES >/dev/tty
    commandline -f repaint
end

on_lines_changed
