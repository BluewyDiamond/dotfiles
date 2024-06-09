return {
   "tpope/vim-fugitive",
   config = function()
      vim.keymap.set("n", "<leader>fu", ":Git blame <CR>", {})
   end,
}
