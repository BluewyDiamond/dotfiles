return {
   "pmizio/typescript-tools.nvim", --> latest commit

   dependencies = {
      { "nvim-lua/plenary.nvim" }, --> latest commit
      { "neovim/nvim-lspconfig" }, --> latest commit
   },
   opts = {},

   config = function()
      require("typescript-tools").setup({})
   end,
}
