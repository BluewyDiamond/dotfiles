return {
   "folke/trouble.nvim",
   opts = { focus = true },
   cmd = "Trouble",

   config = function()
      local trouble = require("trouble")
      trouble.setup({})

      -- trouble.toggle({})

      -- mappings
      --
      vim.keymap.set(
         "n",
         "<leader>ttd",
         "<cmd>Trouble diagnostics toggle<cr>",
         { noremap = true, silent = true, desc = "toggle trouble diagnostics" }
      )
   end,
}
