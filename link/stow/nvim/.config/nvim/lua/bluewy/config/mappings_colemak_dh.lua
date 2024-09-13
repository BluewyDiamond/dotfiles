# https://github.com/Ki11erRabbit/vim-colemak-dh?tab=readme-ov-file#issues

local mappings = {}

mappings.colemak = {
   -- Up/down/left/right
   { "n", "m", "h", { noremap = true, silent = true } },
   { "x", "m", "h", { noremap = true, silent = true } },
   { "o", "m", "h", { noremap = true, silent = true } },
   { "n", "n", "j", { noremap = true, silent = true } },
   { "x", "n", "j", { noremap = true, silent = true } },
   { "o", "n", "j", { noremap = true, silent = true } },
   { "n", "e", "k", { noremap = true, silent = true } },
   { "x", "e", "k", { noremap = true, silent = true } },
   { "o", "e", "k", { noremap = true, silent = true } },
   { "n", "i", "l", { noremap = true, silent = true } },
   { "x", "i", "l", { noremap = true, silent = true } },
   { "o", "i", "l", { noremap = true, silent = true } },

   -- Words forward/backward
   { "n", "l", "b", { noremap = true, silent = true } },
   { "x", "l", "b", { noremap = true, silent = true } },
   { "o", "l", "b", { noremap = true, silent = true } },
   { "n", "L", "B", { noremap = true, silent = true } },
   { "x", "L", "B", { noremap = true, silent = true } },
   { "o", "L", "B", { noremap = true, silent = true } },
   { "n", "u", "e", { noremap = true, silent = true } },
   { "x", "u", "e", { noremap = true, silent = true } },
   { "o", "u", "e", { noremap = true, silent = true } },
   { "n", "U", "E", { noremap = true, silent = true } },
   { "x", "U", "E", { noremap = true, silent = true } },
   { "o", "U", "E", { noremap = true, silent = true } },
   { "n", "y", "w", { noremap = true, silent = true } },
   { "x", "y", "w", { noremap = true, silent = true } },
   { "o", "y", "w", { noremap = true, silent = true } },
   { "n", "Y", "W", { noremap = true, silent = true } },
   { "x", "Y", "W", { noremap = true, silent = true } },
   { "o", "Y", "W", { noremap = true, silent = true } },

   -- Insert/Replace/append
   { "n", "s", "i", { noremap = true, silent = true } },
   { "n", "S", "I", { noremap = true, silent = true } },
   { "n", "t", "a", { noremap = true, silent = true } },
   { "n", "T", "A", { noremap = true, silent = true } },

   -- Change
   { "n", "w", "c", { noremap = true, silent = true } },
   { "x", "w", "c", { noremap = true, silent = true } },
   { "n", "W", "C", { noremap = true, silent = true } },
   { "x", "W", "C", { noremap = true, silent = true } },
   { "n", "ww", "cc", { noremap = true, silent = true } },

   -- Cut/copy/paste
   { "n", "x", "x", { noremap = true, silent = true } },
   { "x", "x", "d", { noremap = true, silent = true } },
   { "n", "c", "y", { noremap = true, silent = true } },
   { "x", "c", "y", { noremap = true, silent = true } },
   { "n", "v", "p", { noremap = true, silent = true } },
   { "x", "v", "p", { noremap = true, silent = true } },
   { "n", "X", "dd", { noremap = true, silent = true } },
   { "x", "X", "d", { noremap = true, silent = true } },
   { "n", "C", "yy", { noremap = true, silent = true } },
   { "x", "C", "y", { noremap = true, silent = true } },
   { "n", "V", "P", { noremap = true, silent = true } },
   { "x", "V", "P", { noremap = true, silent = true } },
   { "n", "gv", "gp", { noremap = true, silent = true } },
   { "x", "gv", "gp", { noremap = true, silent = true } },
   { "n", "gV", "gP", { noremap = true, silent = true } },
   { "x", "gV", "gP", { noremap = true, silent = true } },

   -- Undo/redo
   { "n", "z", "u", { noremap = true, silent = true } },
   { "x", "z", ":<C-U>undo<CR>", { noremap = true, silent = true } },
   { "n", "gz", "U", { noremap = true, silent = true } },
   { "x", "gz", ":<C-U>undo<CR>", { noremap = true, silent = true } },
   { "n", "Z", "<C-R>", { noremap = true, silent = true } },
   { "x", "Z", ":<C-U>redo<CR>", { noremap = true, silent = true } },

   -- Visual mode
   { "n", "a", "v", { noremap = true, silent = true } },
   { "x", "a", "v", { noremap = true, silent = true } },
   { "n", "A", "V", { noremap = true, silent = true } },
   { "x", "A", "V", { noremap = true, silent = true } },
   { "n", "ga", "gv", { noremap = true, silent = true } },
   { "x", "ga", "gv", { noremap = true, silent = true } },

   -- Search
   { "n", "p", "t", { noremap = true, silent = true } },
   { "x", "p", "t", { noremap = true, silent = true } },
   { "o", "p", "t", { noremap = true, silent = true } },
   { "n", "P", "T", { noremap = true, silent = true } },
   { "x", "P", "T", { noremap = true, silent = true } },
   { "o", "P", "T", { noremap = true, silent = true } },
   { "n", "b", ";", { noremap = true, silent = true } },
   { "x", "b", ";", { noremap = true, silent = true } },
   { "o", "b", ";", { noremap = true, silent = true } },
   { "n", "B", ",", { noremap = true, silent = true } },
   { "x", "B", ",", { noremap = true, silent = true } },
   { "o", "B", ",", { noremap = true, silent = true } },
   { "n", "k", "n", { noremap = true, silent = true } },
   { "x", "k", "n", { noremap = true, silent = true } },
   { "o", "k", "n", { noremap = true, silent = true } },
   { "n", "K", "N", { noremap = true, silent = true } },
   { "x", "K", "N", { noremap = true, silent = true } },
   { "o", "K", "N", { noremap = true, silent = true } },

   -- inneR text objects
   { "o", "r", "i", { noremap = true, silent = true } },

   -- Folds, etc.
   { "n", "j", "z", { noremap = true, silent = true } },
   { "x", "j", "z", { noremap = true, silent = true } },

   -- Arguments
   { "o", "a", "a", { noremap = true, silent = true } },

   -- Commands
   { "n", "<leader><Space>", ":nohlsearch<CR>", { noremap = true, silent = true, desc = "Clear search highlight" } },
}

return mappings
