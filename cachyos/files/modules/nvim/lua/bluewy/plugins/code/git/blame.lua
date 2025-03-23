return {
   "FabijanZulj/blame.nvim",

   config = function()
      local blame = require("blame")
      blame.setup({})

      -- mappings
      --
      vim.keymap.set(
         "n",
         "<leader>fu",
         ":BlameToggle<CR>",
         { noremap = true, silent = true, desc = "toggle git blame" }
      )
   end,
}
