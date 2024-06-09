return {
   "lewis6991/gitsigns.nvim",
   event = "VeryLazy",
   config = function()
      require("gitsigns").setup()

      local gitsigns = require("gitsigns")
      vim.keymap.set("n", "]c", function()
         if vim.wo.diff then
            return "]c"
         end
         vim.schedule(gitsigns.next_hunk)

         return "<Ignore>"
      end, { noremap = true, silent = true, expr = true })

      vim.keymap.set("n", "[c", function()
         if vim.wo.diff then
            return "[c"
         end
         vim.schedule(gitsigns.prev_hunk)
         return "<Ignore>"
      end, { noremap = true, silent = true, expr = true })

      vim.keymap.set("n", "<leader>rh", gitsigns.reset_hunk, { noremap = true, silent = true })
      vim.keymap.set("n", "<leader>ph", gitsigns.preview_hunk, { noremap = true, silent = true })
      vim.keymap.set("n", "<leader>gb", package.loaded.gitsigns.blame_line, { noremap = true, silent = true })
      vim.keymap.set("n", "<leader>td", gitsigns.toggle_deleted, { noremap = true, silent = true })
   end,
}
