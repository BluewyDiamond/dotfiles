Utils = {}

Utils.process_mappings = function(mapping_table)
   for _, nested_tables in pairs(mapping_table) do
      for _, mapping_values in ipairs(nested_tables) do
         local mode = mapping_values[1]
         local keybind = mapping_values[2]
         local command = mapping_values[3]
         local options = mapping_values[4]

         vim.keymap.set(mode, keybind, command, options)
      end
   end
end

return Utils
