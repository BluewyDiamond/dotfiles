# [Syntax Color]
#
set fish_color_autosuggestion brblack
set fish_color_cancel --reverse
set fish_color_command normal
set fish_color_comment red
set fish_color_cwd green
set fish_color_cwd_root red
set fish_color_end green
set fish_color_error brred
set fish_color_escape brcyan
set fish_color_history_current --bold
set fish_color_host normal
set fish_color_host_remote yellow
set fish_color_keyword normal
set fish_color_match --background=brblue
set fish_color_normal normal
set fish_color_operator brcyan
set fish_color_option cyan
set fish_color_param cyan
set fish_color_quote yellow
set fish_color_redirection cyan --bold
set fish_color_search_match bryellow '--background=brblack'
set fish_color_selection white --bold '--background=brblack'
set fish_color_status red
set fish_color_user brgreen
set fish_color_valid_path --underline
set fish_pager_color_background
set fish_pager_color_completion normal
set fish_pager_color_description yellow --italics
set fish_pager_color_prefix normal --bold --underline
set fish_pager_color_progress brwhite '--background=cyan'
set fish_pager_color_secondary_background
set fish_pager_color_secondary_completion
set fish_pager_color_secondary_description
set fish_pager_color_secondary_prefix
set fish_pager_color_selected_background --reverse
set fish_pager_color_selected_completion
set fish_pager_color_selected_description
set fish_pager_color_selected_prefix

# [Tide Prompt Stuff]
#
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
