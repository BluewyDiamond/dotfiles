local wezterm = require("wezterm")
local act = wezterm.action

local fish_path = "/usr/bin/fish"

local config = {}

if wezterm.config_builder then
   config = wezterm.config_builder()
end

--------------------
-- Settings
--------------------

config.default_prog = { fish_path, "-l" }

config.color_scheme = "One Dark (Gogh)"

config.font_size = 12
config.font = wezterm.font_with_fallback({
   { family = "Iosevka Nerd Font", scale = 1.4, weight = "Medium" },
   { family = "FantasqueSansM Nerd Font", scale = 1.3 },
})

config.window_background_opacity = 0.9
config.window_decorations = "NONE"
config.window_close_confirmation = "AlwaysPrompt"
config.scrollback_lines = 3000
config.default_workspace = "main"

config.inactive_pane_hsb = {
   saturation = 0.24,
   brightness = 0.5,
}

--------------------
-- Keybindings
--------------------

config.disable_default_key_bindings = true

config.leader = { key = "a", mods = "CTRL", timeout_milliseconds = 1000 }
config.keys = {
   -- Send C-a when pressing C-a twice.
   { key = "a", mods = "LEADER|CTRL", action = act.SendKey({ key = "a", mods = "CTRL" }) },
   { key = "c", mods = "LEADER", action = act.ActivateCopyMode },
   { key = "phys:Space", mods = "LEADER", action = act.ActivateCommandPalette },

   -- pane keybindings

   -- idk, split vertical and horizontal got mixed up
   { key = "h", mods = "LEADER", action = act.SplitVertical({ domain = "CurrentPaneDomain" }) },
   { key = "v", mods = "LEADER", action = act.SplitHorizontal({ domain = "CurrentPaneDomain" }) },
   { key = "n", mods = "LEADER", action = act.ActivatePaneDirection("Left") },
   { key = "e", mods = "LEADER", action = act.ActivatePaneDirection("Down") },
   { key = "u", mods = "LEADER", action = act.ActivatePaneDirection("Up") },
   { key = "i", mods = "LEADER", action = act.ActivatePaneDirection("Right") },
   { key = "q", mods = "LEADER", action = act.CloseCurrentPane({ confirm = true }) },
   { key = "z", mods = "LEADER", action = act.TogglePaneZoomState },
   { key = "o", mods = "LEADER", action = act.RotatePanes("Clockwise") },
   -- We can make separate keybindings for resizing panes
   -- But Wezterm offers custom "mode" in the name of "KeyTable".
   {
      key = "r",
      mods = "LEADER",
      action = act.ActivateKeyTable({ name = "resize_pane", one_shot = false }),
   },

   -- tab keybindings
   { key = "t", mods = "LEADER", action = act.SpawnTab("CurrentPaneDomain") },
   { key = "[", mods = "LEADER", action = act.ActivateTabRelative(-1) },
   { key = "]", mods = "LEADER", action = act.ActivateTabRelative(1) },
   { key = "s", mods = "LEADER", action = act.ShowTabNavigator },
   {
      key = "k",
      mods = "LEADER",
      action = act.PromptInputLine({
         description = wezterm.format({
            { Attribute = { Intensity = "Bold" } },
            { Foreground = { AnsiColor = "Fuchsia" } },
            { Text = "Renaming Tab Title...:" },
         }),
         action = wezterm.action_callback(function(window, pane, line)
            if line then
               window:active_tab():set_title(line)
            end
         end),
      }),
   },
   -- Key table for moving tabs around.
   { key = "m", mods = "LEADER", action = act.ActivateKeyTable({ name = "move_tab", one_shot = false }) },
   -- Or shortcuts to move tab w/o move_tab table. SHIFT is for when caps lock is on.
   { key = "{", mods = "LEADER|SHIFT", action = act.MoveTabRelative(-1) },
   { key = "}", mods = "LEADER|SHIFT", action = act.MoveTabRelative(1) },

   -- Lastly, workspace.
   { key = "w", mods = "LEADER", action = act.ShowLauncherArgs({ flags = "FUZZY|WORKSPACES" }) },
}
-- I can use the tab navigator (LDR t), but I also want to quickly navigate tabs with index.
for i = 1, 9 do
   table.insert(config.keys, {
      key = tostring(i),
      mods = "LEADER",
      action = act.ActivateTab(i - 1),
   })
end

config.key_tables = {
   resize_pane = {
      { key = "n", action = act.AdjustPaneSize({ "Left", 1 }) },
      { key = "e", action = act.AdjustPaneSize({ "Down", 1 }) },
      { key = "u", action = act.AdjustPaneSize({ "Up", 1 }) },
      { key = "i", action = act.AdjustPaneSize({ "Right", 1 }) },
      { key = "Escape", action = "PopKeyTable" },
      { key = "Enter", action = "PopKeyTable" },
   },
   move_tab = {
      { key = "n", action = act.MoveTabRelative(-1) },
      { key = "e", action = act.MoveTabRelative(-1) },
      { key = "u", action = act.MoveTabRelative(1) },
      { key = "i", action = act.MoveTabRelative(1) },
      { key = "Escape", action = "PopKeyTable" },
      { key = "Enter", action = "PopKeyTable" },
   },
}

--------------------
-- Tab Stuff
--------------------

config.use_fancy_tab_bar = false
config.status_update_interval = 1000
config.tab_bar_at_bottom = false

-- Some colors does not seem right with the 'One Dark (Gogh)' color scheme.
config.colors = {
   tab_bar = {
      background = "#23272E",

      inactive_tab = {
         bg_color = "#1E2127",
         fg_color = "#5C6370",
      },

      active_tab = {
         bg_color = "#21252B",
         fg_color = "#7F848E",
      },
   },
}

wezterm.on("update-status", function(window, pane)
   -- workspace name
   local status = window:active_workspace()
   local status_color = "#E06C75" -- red

   -- Constantly displaying the workspace name seems unnecessary.
   -- This space could be better used to showcase LDR or the current key table name.
   if window:active_key_table() then
      status = window:active_key_table()
      status_color = "#61AFEF" -- blue
   end

   if window:leader_is_active() then
      status = "LDR"
      status_color = "#C678DD" -- purple
   end

   local basename = function(s)
      -- Nothing a little regex can't fix.
      return string.gsub(s, "(.*[/\\])(.*)", "%2")
   end

   local current_working_directory = pane:get_current_working_dir()

   if current_working_directory then
      if type(current_working_directory) == "userdata" then
         -- Wezterm introduced the URL object in 20240127-113634-bbcac864.
         current_working_directory = basename(current_working_directory.file_path)
      else
         -- 20230712-072601-f4abf8fd or earlier version
         current_working_directory = basename(current_working_directory)
      end
   else
      current_working_directory = ""
   end

   local current_command = pane:get_foreground_process_name()
   -- CWD and CMD could be nil (e.g. viewing log using Ctrl-Alt-l).
   current_command = current_command and basename(current_command) or ""

   -- time
   local time = wezterm.strftime("%H:%M")

   -- left status (left of the tab line)
   window:set_left_status(wezterm.format({
      { Foreground = { Color = status_color } },
      { Text = "  " },
      { Text = wezterm.nerdfonts.oct_table .. "  " .. status },
      { Text = " |" },
   }))

   -- right status
   window:set_right_status(wezterm.format({
      -- Wezterm has a built-in nerd fonts.
      -- https://wezfurlong.org/wezterm/config/lua/wezterm/nerdfonts.html
      { Text = wezterm.nerdfonts.md_folder .. "  " .. current_working_directory },
      { Text = " | " },
      { Foreground = { Color = "#d19a66" } },
      { Text = wezterm.nerdfonts.fa_code .. "  " .. current_command },
      "ResetAttributes",
      { Text = " | " },
      { Text = wezterm.nerdfonts.md_clock .. "  " .. time },
      { Text = "  " },
   }))
end)

config.window_padding = {
   left = "0cell",
   right = "0cell",
   top = "0cell",
   bottom = "0cell",
}

return config
