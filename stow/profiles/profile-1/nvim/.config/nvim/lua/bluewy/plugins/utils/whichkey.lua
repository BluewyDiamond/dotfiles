return {
   "folke/which-key.nvim",
   version = "2.*",
   event = "VeryLazy",

   init = function()
      vim.o.timeout = true
      vim.o.timeoutlen = 300
   end,

   opts = {},
}
