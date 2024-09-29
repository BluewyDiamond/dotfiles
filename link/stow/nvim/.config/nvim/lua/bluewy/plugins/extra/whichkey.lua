return {
   "folke/which-key.nvim", --> latest commit
   event = "VeryLazy",

   init = function()
      vim.o.timeout = true
      vim.o.timeoutlen = 300
   end,

   opts = {},
}
