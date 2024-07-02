require("bluewy.core.options")
require("bluewy.core.lazy")

local map = vim.keymap.set

local function process_mappings(mapping_table)
   for _, nested_tables in pairs(mapping_table) do
      for _, mapping_values in ipairs(nested_tables) do
         local mode = mapping_values[1]
         local keybind = mapping_values[2]
         local command = mapping_values[3]
         local options = mapping_values[4]

         map(mode, keybind, command, options)
      end
   end
end

local mappings = require("bluewy.core.mappings")

process_mappings(mappings)
