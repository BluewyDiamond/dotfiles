if not status is-interactive
    return
end

# Hardcoded ANSI color escape sequences
# Each line sets a specific ANSI color index (0-15) to a hardcoded hex color value

# Normal colors (0-7)
echo -en "\033]P01E2127" # Black
echo -en "\033]P1E06C75" # Red
echo -en "\033]P298C379" # Green
echo -en "\033]P3D19A66" # Yellow
echo -en "\033]P461AFEF" # Blue
echo -en "\033]P5C678DD" # Magenta
echo -en "\033]P656B6C2" # Cyan
echo -en "\033]P7ABB2BF" # White

# Bright colors (8-15)
echo -en "\033]P85C6370" # Bright Black (Gray)
echo -en "\033]P9E06C75" # Bright Red
echo -en "\033]Pa98C379" # Bright Green
echo -en "\033]PbD19A66" # Bright Yellow
echo -en "\033]Pc61AFEF" # Bright Blue
echo -en "\033]PdC678DD" # Bright Magenta
echo -en "\033]Pe56B6C2" # Bright Cyan
echo -en "\033]PfABB2BF" # Bright White

# Reset the terminal to apply changes
echo -en "\033\\"

# Display a message to indicate the colors have been set
echo "TTY colors have been set using hardcoded escape codes."
