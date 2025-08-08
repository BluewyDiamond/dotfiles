function _tide_item_context
    if set -q SSH_TTY || set -q SSH_CONNECTION
        set -l colored_host (set_color yellow)$current_host(set_color normal)
        _tide_print_item context (set_color yellow)"$USER""@""$hostname (ssh)"
    else
        set -l colored_host $current_host
        _tide_print_item context (set_color yellow)"$USER""@""$hostname"
    end
end

if status is-interactive
    set -U tide_left_prompt_items time context pwd git status newline character
    set -U tide_right_prompt_items
end
