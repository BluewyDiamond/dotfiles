return {
   "nvim-neo-tree/neo-tree.nvim",
   branch = "v3.x",

   dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-tree/nvim-web-devicons",
      "MunifTanjim/nui.nvim",
      "3rd/image.nvim",
   },

   config = function()
      vim.keymap.set(
         "n",
         "<C-n>",
         ":Neotree source=filesystem reveal=true position=right toggle<CR>",
         { noremap = true, silent = true }
      )
      vim.keymap.set(
         "n",
         "<leader>e",
         ":Neotree source=filesystem reveal=true position=right focus<CR>",
         { noremap = true, silent = true }
      )
      vim.keymap.set("n", "<leader>bf", ":Neotree buffers reveal float<CR>", { noremap = true, silent = true })
   end,
}
